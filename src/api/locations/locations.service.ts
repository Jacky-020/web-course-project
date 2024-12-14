import { Injectable, Logger } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { Location } from './entities/location.entity';
import { JSDOM } from 'jsdom'
import { GraphQLError } from 'graphql';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  constructor(@InjectModel(Location.name) private locationModel: Model<Location>) {}
  async create(createLocationInput: CreateLocationInput) {
    return this.locationModel.create(createLocationInput);
  }

  async findAll() {
    return this.locationModel.find().exec();
  }

  async findOne(id: number) {
    return this.locationModel.findOne({id: id}).exec();
  }

  async update(id: number, updateLocationInput: UpdateLocationInput) {
    return this.locationModel.findOneAndUpdate({id: id}, updateLocationInput).exec();
  }

  async remove(id: number) {
    let doc = await this.locationModel.findOneAndDelete({id: id}).exec();
    // FIXME: Experimental; This combined with format error gives an OK
    // error message, but the GraphQLError is not caught and still shows
    // up in stdout
    if (doc === null) {
      throw new GraphQLError(
        "No such location!", {extensions: {code: "BAD_USER_INPUT"}},
      )
    }
    return doc;
  }

  async fetchFromSource() {
    // updates the locations data from the official LCSD datasource
    const DATA_URL = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';
    let response = await fetch(DATA_URL);
    if (response.status !== 200) {
      this.logger.warn("fetch returns non 200 code, something may be wrong!");
    }
    let parser = new JSDOM(await response.text(), {contentType: "application/xml"});
    let doc = parser.window.document;
    const getOneText = (tag: Element, subtagName: string) => tag.getElementsByTagName(subtagName)[0].textContent;
    const strToNumOrNull = (s: string) => s.trim() === ""? null : Number(s.trim());
    for (const venueTag of doc.getElementsByTagName('venue')) {
      let loc: Location = {
        id: Number(venueTag.getAttribute("id")),
        chi_name: getOneText(venueTag, "venuec"),
        en_name: getOneText(venueTag, "venuee"),
        latitude: strToNumOrNull(getOneText(venueTag, "latitude")),
        longitude: strToNumOrNull(getOneText(venueTag, "longitude")),
      };
      this.locationModel.findOneAndUpdate(
        { id: loc.id },
        loc,
        { upsert: true }, // creates a new item if does not exist
      ).exec();
    }
    this.logger.log(`Updated location data from ${DATA_URL}`);
  }
}
