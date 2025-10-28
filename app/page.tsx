// app/page.tsx (bonuschange проект)

import styles from "@/styles/style";
import Companies from "../components/companies";
import { cookies } from "next/headers";
import {
  Navbar,
  Hero,
  Stats,
  Business,
  Billing,
  CardDeal,
  Testimonials,
  Clients,
  CTA,
  Footer,
} from "@/components";
import { Metadata } from "next";
// import Frame from "@/components/Frame";
import { CookieWriter } from "@/components/CookieWriter";
import { getUserCountry } from "@/lib/geo"; // ← ДОБАВИЛ

export const metadata: Metadata = {
  title: "Bonus Chance",
};

type BrandPair = {
  brand: { brand_logo: string; casino_brand: string; id?: string | number };
  content: { value: string; our_link: string; geo: string }; // ← ДОБАВИЛ geo
};

const ALLOWED = ['partner1039', 'partner1043', 'partner1044', 'partner1045', 'partnerCLD']; // ← ДОБАВИЛ

export default async function Home({
  searchParams, // ← ДОБАВИЛ
}: {
  searchParams: { partner?: string; keyword?: string; ad_campaign_id?: string };
}) {
  const cookieStore = await cookies();

  // ← ИЗМЕНИЛ: приоритет URL → cookies
  const urlPartner = searchParams.partner && ALLOWED.includes(searchParams.partner) 
    ? searchParams.partner 
    : null;

  const partner_id = urlPartner || cookieStore.get("partnerId")?.value || "partner1000";
  const keyword = searchParams.keyword || cookieStore.get("rawKeyword")?.value || "";
  const ad_campaign_id = searchParams.ad_campaign_id || cookieStore.get("ad_campaign_id")?.value || "";

  console.log('👤 Partner:', partner_id, urlPartner ? '(from URL)' : '(from cookies)');

  // ← ДОБАВИЛ: определение GEO
  const geo = await getUserCountry();
  console.log('🌍 GEO:', geo);

  // ← ИЗМЕНИЛ: динамический geo вместо хардкода CA
  const hottest = `https://born.topbon.us/end/fetch/brand_fetcher.php?partner_id=${encodeURIComponent(
    partner_id
  )}&geo=${geo}&category=Hottest`;
  const popular = `https://born.topbon.us/end/fetch/brand_fetcher.php?partner_id=${encodeURIComponent(
    partner_id
  )}&geo=${geo}&category=Popular`;
  const vip = `https://born.topbon.us/end/fetch/brand_fetcher.php?partner_id=${encodeURIComponent(
    partner_id
  )}&geo=${geo}&category=Vip`;

  const res = await fetch(hottest, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const data: any[] = await res.json();

  const res2 = await fetch(popular, { next: { revalidate: 300 } });
  if (!res2.ok) throw new Error(`fetch failed: ${res2.status}`);
  const data2: any[] = await res2.json();

  const res3 = await fetch(vip, { next: { revalidate: 300 } });
  if (!res3.ok) throw new Error(`fetch failed: ${res3.status}`);
  const data3: any[] = await res3.json();

  // ← ИЗМЕНИЛ: передаем geo в функцию
  const processedBrandsHottest = processDataNoGeo(data, partner_id, geo);
  const processedBrandsPopular = processDataNoGeo(data2, partner_id, geo);
  const processedBrandsVip = processDataNoGeo(data3, partner_id, geo);

  return (
    <>
      <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        <CookieWriter />

        {/* <Frame
          brands={processedBrandsVip}
          keyword={keyword}
          partnerId={partner_id}
          adCampaignId={ad_campaign_id}
        /> */}
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero
              brands={processedBrandsVip}
              keyword={keyword}
              partnerId={partner_id}
              ad_campaign_id={ad_campaign_id}
            />
          </div>
        </div>

        <Testimonials
          brands={processedBrandsHottest}
          keyword={keyword}
          partnerId={partner_id}
          ad_campaign_id={ad_campaign_id}
        />

        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <div className="w-full flex flex-col justify-center items-center flex-col sm:mb-10 mb-6 relative z-[1]">
              <h1 className="text-center text-[36px] font-poppins font-semibold ss:leading-[46.8px] leading-[66.8px] text-white">
                Newly bonuses
              </h1>

              <p className={`${styles.paragraph} text-center max-w-[450px]`}>
                You can find new offers and their bonuses in our selection.
              </p>
            </div>
            <Companies
              brands={processedBrandsPopular}
              keyword={keyword}
              partnerId={partner_id}
              ad_campaign_id={ad_campaign_id}
            />
            <CTA
              brands={processedBrandsPopular}
              keyword={keyword}
              partnerId={partner_id}
              ad_campaign_id={ad_campaign_id}
            />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- helpers ----------
type LangContent = { geo?: string; value?: string; our_link?: string };
type LangBlock = {
  partner_id?: string;
  our_link?: string;
  content?: LangContent[];
};

function pickLangBlock(
  languages: unknown,
  partnerId: string
): LangBlock | null {
  const arr: LangBlock[] = Array.isArray(languages)
    ? (languages as LangBlock[])
    : typeof languages === "string"
    ? JSON.parse(languages || "[]")
    : [];
  if (!arr.length) return null;
  return (
    arr.find(
      (l) => (l.partner_id || "").toLowerCase() === partnerId.toLowerCase()
    ) ||
    arr.find((l) => (l.partner_id || "").toLowerCase() === "partner1039") ||
    arr[0] ||
    null
  );
}

function pickContent(block: LangBlock | null, geo: string): LangContent | null {
  if (!block?.content?.length) return null;
  const G = geo.toUpperCase();
  return (
    block.content.find((c) => (c.geo || "").toUpperCase() === G) ||
    block.content.find((c) => (c.geo || "").toUpperCase() === "ALL") ||
    block.content[0] ||
    null
  );
}

function processDataNoGeo(
  data: any[],
  partner_id: string,
  geo: string = "CA"
): BrandPair[] {
  if (!Array.isArray(data)) return [];
  const shuffled = [...data];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled
    .map((brand: any) => {
      const block = pickLangBlock(brand?.languages, partner_id);
      if (!block) return null;
      const c = pickContent(block, geo);
      if (!c) return null;
      const our_link = String(c.our_link || block.our_link || "");
      if (!our_link) return null;
      return {
        brand: {
          brand_logo: String(brand?.brand_logo ?? ""),
          casino_brand: String(brand?.casino_brand ?? ""),
        },
        content: { value: String(c.value ?? ""), our_link },
      };
    })
    .filter(Boolean) as BrandPair[];
}