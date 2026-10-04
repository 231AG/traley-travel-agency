import { describe, expect, it } from "vitest";
import { buildMessage, formatDate, formatMonth } from "@lib/quote/message";
import { whatsappUrl } from "@lib/quote/whatsapp";
import { conciergeSchema, dateErrors, flightSchema } from "@lib/quote/schema";
import { validateQuote, withOtherDestination } from "@lib/quote/fields";

describe("buildMessage", () => {
  it("builds the flight template in order", () => {
    const message = buildMessage("flights", {
      to: "London (LHR)",
      departure: "2026-11-04",
      return: "2026-12-01",
      travelers: "2 adults",
    });
    expect(message).toBe(
      [
        "Hello Tarley Travel, I'd like a flight quote.",
        "From: Monrovia (ROB)",
        "To: London (LHR)",
        "Departure: 4 November 2026",
        "Return: 1 December 2026",
        "Travelers: 2 adults",
        "Sent from tarleytravel.com",
      ].join("\n"),
    );
  });

  it("leaves out empty fields", () => {
    const message = buildMessage("flights", { to: "Accra", departure: "", return: "  " });
    expect(message).not.toMatch(/Departure|Return|Travelers/);
    expect(message).toContain("From: Monrovia (ROB)");
  });

  it("keeps a custom origin", () => {
    expect(buildMessage("flights", { from: "Buchanan", to: "Accra" })).toContain("From: Buchanan");
  });

  it("builds the visa template", () => {
    expect(buildMessage("visa", { destination: "Canada", reason: "Study", month: "2027-01" })).toBe(
      [
        "Hello Tarley Travel, I'd like help with a visa.",
        "Destination: Canada",
        "Reason for travel: Study",
        "Planned travel month: January 2027",
        "Sent from tarleytravel.com",
      ].join("\n"),
    );
  });

  it("builds the concierge template with a list of services", () => {
    expect(
      buildMessage("concierge", {
        arrival: "2026-12-20",
        services: ["Airport pickup", "Car with driver"],
      }),
    ).toBe(
      [
        "Hello Tarley Travel, I'm planning a trip to Liberia.",
        "Arrival date: 20 December 2026",
        "Services needed: Airport pickup, Car with driver",
        "Sent from tarleytravel.com",
      ].join("\n"),
    );
  });

  it("drops an empty services list", () => {
    expect(buildMessage("concierge", { arrival: "2026-12-20", services: [] })).not.toContain(
      "Services",
    );
  });
});

describe("formatters", () => {
  it("formats dates and months", () => {
    expect(formatDate("2026-03-09")).toBe("9 March 2026");
    expect(formatMonth("2026-03")).toBe("March 2026");
    expect(formatMonth("Not sure yet")).toBe("Not sure yet");
  });
});

describe("whatsappUrl", () => {
  it("encodes the message for wa.me", () => {
    const url = whatsappUrl("Hello & welcome\nTo: São Paulo");
    expect(url).toBe(
      "https://wa.me/231886504519?text=Hello%20%26%20welcome%0ATo%3A%20S%C3%A3o%20Paulo",
    );
    expect(decodeURIComponent(url.split("text=")[1] ?? "")).toBe("Hello & welcome\nTo: São Paulo");
  });
});

describe("dateErrors", () => {
  it("rejects past dates and a return before departure", () => {
    expect(dateErrors({ departure: "2026-01-01" }, "2026-10-03")).toHaveProperty("departure");
    expect(
      dateErrors({ departure: "2026-11-10", return: "2026-11-01" }, "2026-10-03"),
    ).toHaveProperty("return");
    expect(dateErrors({ departure: "2026-11-10", return: "2026-11-20" }, "2026-10-03")).toEqual({});
  });
});

describe("schemas", () => {
  it("accepts a one-way flight with empty dates", () => {
    expect(flightSchema.safeParse({ to: "Accra", departure: "", return: "" }).success).toBe(true);
  });
  it("requires a destination for flights", () => {
    const result = flightSchema.safeParse({ to: "  " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Enter where you want to fly to.");
  });
  it("gives the arrival message for an empty concierge date", () => {
    const result = conciergeSchema.safeParse({ arrival: "", services: [] });
    expect(result.error?.issues.every((i) => i.message === "Enter your arrival date.")).toBe(true);
  });
});

describe("validateQuote", () => {
  const today = "2026-10-04";
  it("passes a complete flight request", () => {
    expect(validateQuote("flights", { to: "Accra", departure: "2026-11-01" }, today)).toEqual({});
  });
  it("reports the first problem per field", () => {
    const errors = validateQuote("flights", { to: "", departure: "2026-01-01" }, today);
    expect(errors["to"]).toBe("Enter where you want to fly to.");
    expect(errors["departure"]).toBe("Choose a date from today onward.");
  });
  it("needs an arrival date for concierge", () => {
    expect(validateQuote("concierge", { arrival: "", services: [] }, today)).toHaveProperty(
      "arrival",
    );
  });
});

describe("withOtherDestination", () => {
  it("uses the typed country when Somewhere else is chosen", () => {
    const fields = { destination: "Somewhere else", destinationOther: "Ghana" } as Parameters<
      typeof withOtherDestination
    >[0];
    expect(withOtherDestination(fields)).toEqual({ destination: "Ghana" });
  });
  it("leaves a listed destination alone", () => {
    expect(withOtherDestination({ destination: "Canada" })).toEqual({ destination: "Canada" });
  });
});
