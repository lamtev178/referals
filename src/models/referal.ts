import { dataBase } from "../db/index";
import { Link } from "../entity/link.entity";
import { Refer } from "../entity/refer.entity";
import { User } from "../entity/user.entity";

class ReferalsController {
  async getUsers() {
    return await dataBase.manager.find(User);
  }

  async getLinks() {
    return await dataBase.manager.find(Link);
  }

  async getRefers() {
    return await dataBase.manager.find(Refer);
  }

  async createLink(userId: string) {
    const user = new User();
    user.id = userId;
    await dataBase.manager.save(user);
    const link = new Link();
    link.sale = 50;
    link.user = user;
    await dataBase.manager.save(link);
    return link.id;
  }

  async startReferral(linkId: string, userId: string) {
    const refer = new Refer();
    const link = await dataBase
      .createQueryBuilder(Link, "link")
      .where("link.id = :id", { id: linkId })
      .getOne();

    if (link) {
      refer.link = link;
      refer.id = userId;
      if (link?.referes) link?.referes.push(refer);
      else link.referes = [refer];
      await dataBase.manager.save(refer);
      return;
    }
    throw new Error("link is not valid");
  }

  async getMyLinks(userId: string) {
    const user = await dataBase
      .createQueryBuilder(User, "user")
      .leftJoinAndSelect("user.links", "links")
      .where("user.id = :userId", { userId })
      .getOne();
    if (!user) throw new Error("no such user");
    return user?.links;
  }

  async getMyReferrals(userId: string) {
    const myRefs: Record<string, Refer[]> = {};
    const userLinks = await this.getMyLinks(userId);

    const linkWithRefs = await dataBase
      .createQueryBuilder(Link, "link")
      .leftJoinAndSelect("link.referes", "referes")
      .where("link.id IN (:...links)", {
        links: userLinks.map((link) => link.id),
      })
      .getMany();

    if (linkWithRefs.length) {
      linkWithRefs.forEach((link) => {
        myRefs[`${link.id}`] = link.referes;
      });
    }

    return myRefs;
  }

  async payReferrer(userId: string) {
    const linkSale = await dataBase
      .createQueryBuilder(Refer, "refer")
      .leftJoinAndSelect("refer.link", "link")
      .where("refer.id = :id", { id: userId })
      .getOne();
    console.log("linkSale", linkSale);

    if (linkSale && linkSale.link) return linkSale.link.sale;
    return 0;
  }
}
const referals = new ReferalsController();

export default referals;
