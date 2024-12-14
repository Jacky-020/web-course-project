import { Injectable, Logger } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JSDOM } from 'jsdom'
import { Event } from './entities/event.entity';
import { Location } from '../locations/entities/location.entity';
import { date } from 'yup';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}
  async create(createEventInput: CreateEventInput) {
    return this.eventModel.create(createEventInput);
  }

  async findAll() {
    return this.eventModel.find().exec();
  }

  async findOne(id: number) {
    return this.eventModel.findOne({id: id}).exec();
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return this.eventModel.findOneAndUpdate({id: id}, updateEventInput).exec();
  }

  remove(id: number) {
    return this.eventModel.deleteOne({id: id}).exec();
  }
  async fetchFromSource() {
    const DATA_URL = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";
    let response = await fetch(DATA_URL);
    if (response.status !== 200) {
      this.logger.warn("fetch returns non 200 code, something may be wrong!");
    }
    let doc = (new JSDOM(await response.text(), {contentType: "application/xml"})).window.document;
    const datestrToDate = (s: string) => {
      let s_trim = s.trim().replace(' ', 'T');
      return s_trim === ""? null : new Date(s_trim);
    }
    for (const eventTag of doc.getElementsByTagName("event")) {
      const getOneText = (subtagName: string) => eventTag.getElementsByTagName(subtagName)[0].textContent;
      let event: Event = {
        id: Number(eventTag.getAttribute("id")),
        chi_title: getOneText("titlec"),
        en_title: getOneText("titlee"),
        cat1: getOneText("cat1"),
        cat2: getOneText("cat2"),
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
      };
      this.eventModel.findOneAndUpdate({id: event.id}, event, {upsert: true}).exec();
    }
    this.logger.log(`Updated events information from source ${DATA_URL}`);
  }
}
