import { Node } from "@siteimprove/alfa-dom";
import { Page } from "@siteimprove/alfa-web";
import { Request, Response } from "@siteimprove/alfa-http";
import { Device } from "@siteimprove/alfa-device";
import { Array } from "@siteimprove/alfa-array";
import { Audit, Outcome } from "@siteimprove/alfa-act";

import * as dom from "@siteimprove/alfa-dom/native";
import * as device from "@siteimprove/alfa-device/native";

import FlattenedRules from "@siteimprove/alfa-rules";

describe("The Home Page", () => {
  it("successfully loads", async () => {
    cy.visit("/");

    cy.get("input[name=uuid]").type(crypto.randomUUID());

    cy.contains("Change Background").click();

    await accessible();
  });
});

async function accessible() {
  const nodeJSON = await dom.Native.fromNode(document);
  const deviceJSON = device.Native.fromWindow(window);
  const pageDevice = Device.from(deviceJSON);

  const page = Page.of(
    Request.empty(),
    Response.empty(),
    Node.from(nodeJSON),
    pageDevice,
  );

  const result = Array.from(await Audit.of(page, FlattenedRules).evaluate());

  const failed = result.filter(Outcome.isFailed);
  if (failed.length > 0) {
    console.log(failed);
    throw Error("Page is not accessible");
  }
}
