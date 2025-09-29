'use client';
import styles from "@/styles/style";
import Button from "./Button";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";
import { mergeTracking, type Tracking } from "@components/lib/useTracking";

type Brand = {
  brand: { brand_logo?: string };
  content: { value?: string; our_link?: string };
};

export default function CTA({
  brands,
  keyword,
  partnerId,
  ad_campaign_id,
}: {
  brands: Brand[];
  keyword: string;
  partnerId: string;
  ad_campaign_id: string;
}) {
  const [track, setTrack] = useState<Tracking>({
    keyword,
    partnerId,
    ad_campaign_id,
  });
  useEffect(() => {
    setTrack(mergeTracking({ keyword, partnerId, ad_campaign_id }));
  }, [keyword, partnerId, ad_campaign_id]);

  const displayed = (brands || []).filter(Boolean).slice(0, 1);

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
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
    >
      <div className="flex-1 flex flex-col">
        <h2 className={styles.heading2}>Here’s a surprise</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          If you feel today is your lucky day — make sure to check what we’ve
          got for you.
        </p>
      </div>
      {displayed.map((item, idx) => {
        if (!item?.brand?.brand_logo || !item?.content?.our_link) return null;

        const sanitizedContent = DOMPurify.sanitize(
          String(item.content.value ?? "")
        );
        const imageSrc = `/images/brands/${item.brand.brand_logo}.png`;
        const url = buildTrackedUrl(item.content.our_link);

        return (
          <div
            key={idx}
            className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}
          >
            <Link href={url} target="_blank">
              <Button />{" "}
            </Link>
          </div>
        );
      })}
    </section>
  );
}
