import { Injectable, Logger } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JSDOM } from 'jsdom'
import crypto from 'node:crypto'
import { Event, EventMeta } from './entities/event.entity';
import { Location } from '../locations/entities/location.entity';
import parser from 'any-date-parser';
import { populate } from 'dotenv';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
    @InjectModel(EventMeta.name) private eventMetaModel: Model<EventMeta>,
  ) {}
  async create(createEventInput: CreateEventInput) {
    return this.eventModel.create(createEventInput);
  }

  async findAll() {
    return this.eventModel.find(null, null, { populate: ['venue', 'comments'] }).exec();
  }

  async findOne(id: number) {
    return this.eventModel.findOne({id: id}, null, { populate: ['venue', 'comments' ]}).exec();
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return this.eventModel.findOneAndUpdate({id: id}, updateEventInput).exec();
  }

  remove(id: number) {
    return this.eventModel.deleteOne({id: id}).exec();
  }

  async getMeta() {
    return this.eventMetaModel.findOne().exec();
  }

  async fetchFromSource(force: boolean = false) {
    const DATA_URL = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";
    let response = await fetch(DATA_URL);
    if (response.status !== 200) {
      this.logger.warn("fetch returns non 200 code, something may be wrong!");
    }
    let content = await response.text();
    let meta = await this.getMeta() || new this.eventMetaModel();
    let content_hash = crypto.createHash('sha256').update(content).digest('hex');
    if (!force && meta.data_hash === content_hash) {
      // same as last, no need to update
      meta.last_update = new Date(Date.now());
      meta.save();
      this.logger.log("Events information is up to date.");
      return;
    }
    let doc = (new JSDOM(content, {contentType: "application/xml"})).window.document;
    const datestrToDate = (s: string) => {
      let s_trim = s.trim().replace(' ', 'T');
      return s_trim === ""? null : new Date(s_trim);
    }
    for (const eventTag of doc.getElementsByTagName("event")) {
      const getOneText = (subtagName: string) => eventTag.getElementsByTagName(subtagName)[0].textContent;
      const parsedDate = parser.fromString(getOneText("predateE"));
      if (!parsedDate.isValid()) continue;
      let event: Event = {
        id: Number(eventTag.getAttribute("id")),
        chi_title: getOneText("titlec"),
        en_title: getOneText("titlee"),
        cat1: getOneText("cat1"),
        cat2: getOneText("cat2"),
        date: parsedDate,
        date_c: getOneText("predateC"),
        date_e: getOneText("predateE"),
        duration_c: getOneText("progtimec"),
        duration_e: getOneText("progtimee"),
        venue: (await this.locationModel.findOne({id: Number(getOneText("venueid"))}).exec()),
        agelimit_c: getOneText("agelimitc"),
        agelimit_e: getOneText("agelimite"),
        price_c: getOneText("pricec"),
        price_e: getOneText("pricee"),
        desc_c: getOneText("descc"),
        desc_e: getOneText("desce"),
        url_c: getOneText("urlc"),
        url_e: getOneText("urle"),
        ticket_agent_url_c: getOneText("tagenturlc"),
        ticket_agent_url_e: getOneText("tagenturle"),
        remarks_c: getOneText("remarkc"),
        remarks_e: getOneText("remarke"),
        tel: getOneText("enquiry"),
        fax: getOneText("fax"),
        email: getOneText("email"),
        sale_date: datestrToDate(getOneText("saledate")),
        online_ticketing: getOneText("interbook") === "Y",
        presenter_c: getOneText("presenterorgc"),
        presenter_e: getOneText("presenterorge"),
        date_created: datestrToDate(getOneText("submitdate")),
        comments: [],
      };
      this.eventModel.findOneAndUpdate({id: event.id}, event, {upsert: true}).exec();
    }
    meta.last_update = new Date(Date.now());
    meta.data_hash = content_hash;
    meta.save();
    this.logger.log(`${force? '[Forced update] ': ''}Updated events information from source ${DATA_URL}`);
  }
}
