import express from "express";
import referals from "../models/referal";

export const refRouter = express.Router();

refRouter.get("/", (req, res) => res.send("Hello!"));
refRouter.get("/users", async (req, res) => {
  res.send(await referals.getUsers());
});
refRouter.get("/my-refs", async (req, res) => {
  try {
    const user = req.query.user;
    if (!user) throw new Error("user is required");
    res.send({ referals: await referals.getMyReferrals(+user) });
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
});

refRouter.get("/links", async (req, res) => {
  res.send(await referals.getLinks());
});

refRouter.get("/refers", async (req, res) => {
  res.send(await referals.getRefers());
});

refRouter.post("/ref-link", async (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).send({ error: "user is required" });
  res.send({ link: await referals.createLink(user) });
});

refRouter.post("/start-ref", async (req, res) => {
  try {
    const { userId, linkId } = req.body;
    await referals.startReferral(linkId, userId);
    res.send("complete");
  } catch (err: any) {
    res.status(404).send({ error: err.message });
  }
});
refRouter.post("/pay", async (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).send({ error: "user is required" });
  res.send({ sale: await referals.payReferrer(user) });
});
