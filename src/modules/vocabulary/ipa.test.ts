import { describe, expect, it } from "vitest";
import { arpabetToIpa } from "./ipa";

describe("arpabetToIpa", () => {
  it("converts single-syllable words without a stress mark", () => {
    expect(arpabetToIpa("K AE1 T")).toBe("kæt");
    expect(arpabetToIpa("S IY1 T")).toBe("siːt");
  });

  it("places the primary stress mark before the stressed syllable", () => {
    expect(arpabetToIpa("AH0 B AE1 N D AH0 N")).toBe("əˈbændən");
    expect(arpabetToIpa("IH0 N F ER0 M EY1 SH AH0 N")).toBe("ɪnfərˈmeɪʃən");
  });

  it("keeps legal onset clusters together", () => {
    expect(arpabetToIpa("IH0 N S T R AH1 K SH AH0 N")).toBe("ɪnˈstrʌkʃən");
  });

  it("marks secondary stress", () => {
    expect(arpabetToIpa("EH2 JH AH0 K EY1 SH AH0 N")).toBe("ˌedʒəˈkeɪʃən");
  });
});
