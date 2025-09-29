"use client";

import styles from "@/styles/style";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";
import { mergeTracking, type Tracking } from "@components/lib/useTracking";

export type Brand = {
  brand: { brand_logo?: string };
  content: { value?: string; our_link?: string };
};

type Props = {
  brands: Brand[];
  keyword: string;
  partnerId: string;
  ad_campaign_id: string;
};

const PHRASES = [
  "Top-rated bonuses and fast withdrawals.",
  "Trusted by thousands — play with confidence.",
  "Exclusive bonus you won't find anywhere else.",
];

export default function Testimonials({
  brands,
  keyword,
  partnerId,
  ad_campaign_id,
}: Props) {
  const [track, setTrack] = useState<Tracking>({
    keyword,
    partnerId,
    ad_campaign_id,
  });

  useEffect(() => {
    setTrack(mergeTracking({ keyword, partnerId, ad_campaign_id }));
  }, [keyword, partnerId, ad_campaign_id]);

  const displayed = (brands || []).filter(Boolean);

  const buildTrackedUrl = (base?: string) => {
    if (!base) return "#";
    const params = new URLSearchParams();
    if (track.keyword) params.set("keyword", track.keyword);
    if (track.partnerId) params.set("source", track.partnerId);
    if (track.ad_campaign_id)
      params.set("ad_campaign_id", track.ad_campaign_id);
    const qs = params.toString();
    return qs ? `${base}${base.includes("?") ? "&" : "?"}${qs}` : base;
  };

  return (
    <section
      id="clients"
      className={`sm\:pb-16 pb-6 ${styles.flexCenter} flex-col relative`}
    >
      <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient" />
      <div className="w-full flex flex-col justify-center items-center flex-col sm:mb-10 mb-6 relative z-[1]">
        <h1 className="text-center text-[36px] font-poppins font-semibold ss:leading-[46.8px] leading-[66.8px] text-white">
          Choice from us
        </h1>

        <p className={`${styles.paragraph} text-center max-w-[450px]`}>
          Here you can find the best offers and their bonuses from recent times
          according to our evaluation.
        </p>
      </div>

      <div className="flex flex-wrap sm:justify-center justify-center w-full feedback-container relative z-[1]">
        {displayed.slice(0, 3).map((item, idx) => {
          if (!item?.brand?.brand_logo || !item?.content?.our_link) return null;

          // Берём статичную фразу по индексу
          const staticPhrase = PHRASES[idx % PHRASES.length];
          const sanitizedContent = DOMPurify.sanitize(staticPhrase);
          const sanitizedContent2 = DOMPurify.sanitize(
            String(item.content.value ?? "")
          );
          const imageSrc = `/images/brands/${item.brand.brand_logo}.png`;
          const url = buildTrackedUrl(item.content.our_link);

          return (
            <Link
              key={idx}
              href={url}
              target="_blank"
              className="flex justify-between flex-col px-10 py-12 rounded-[20px] max-w-[370px] md:mr-10 sm:mr-5 mr-0 feedback-card cursor-pointer"
            >
              <Image
                src={"/assets/quotes.svg"}
                alt={"quotes"}
                className="object-contain"
                width={42}
                height={27}
              />
              <p
                className="font-poppins font-normal text-[18px] leading-[32px] text-white my-10"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
              <div className="flex flex-row">
                <Image
                  src={imageSrc}
                  alt={imageSrc}
                  className="rounded-full object-contain object-center"
                  width={96}
                  height={48}
                />
                <div className="flex flex-col ml-4">
                  <h4 className="font-poppins font-semibold text-[20px] leading-[32px] text-white">
                    {item.brand.brand_logo}
                  </h4>
                  <p
                    className="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent2 }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
