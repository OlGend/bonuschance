"use client";
import styles from "@/styles/style";
import { discount, robot } from "@/public/assets";
import { arrowUp } from "@/public/assets";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";
import { mergeTracking, type Tracking } from "@components/lib/useTracking";

type Brand = {
  brand: { brand_logo?: string };
  content: { value?: string; our_link?: string };
};

export default function Home({
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
    <section id="home">
      {displayed.map((item, idx) => {
        if (!item?.brand?.brand_logo || !item?.content?.our_link) return null;

        const sanitizedContent = DOMPurify.sanitize(
          String(item.content.value ?? "")
        );
        const imageSrc = `/images/brands/${item.brand.brand_logo}.png`;
        const url = buildTrackedUrl(item.content.our_link);

        return (
          <div
            className={`flex md:flex-row flex-col ${styles.paddingY}`}
            key={idx}
          >
            <div
              className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
            >
              <div className=" flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
                <Link href={url} target="_blank">
                  <p className={`${styles.paragraph} ml-2`}>
                    Month selection <span className="text-white">by</span>{" "}
                    winnings
                  </p>
                </Link>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[32px] text-white ss:leading-[100px] leading-[42px]">
                  The Next <br className="sm:block hidden" />{" "}
                  <span className="text-gradient">{item.brand.brand_logo}</span>{" "}
                </h1>
                <div className="ss:flex hidden md:mr-4 mr-0">
                  <div
                    className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}
                  >
                    <div
                      className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}
                    >
                      <Link href={url} target="_blank">
                        <div className={`${styles.flexStart} flex-row`}>
                          <p className="font-poppins font-medium text-[18px] leading-[23px]">
                            <span className="text-gray-50">Get</span>
                          </p>
                          <Image
                            src={arrowUp}
                            alt="arrow"
                            className="w-[23px] h-[23px] object-contain ml-2"
                          />
                        </div>
                      </Link>
                      <p className="font-poppins font-medium text-[18px] leading-[23px]">
                        <span className="text-gray-50">Started</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="w-full font-poppins font-semibold ss:text-[72px] text-[32px] text-white ss:leading-[100px] leading-[42px]">
                Casino Bonus
              </h1>

              <p
                className={`${styles.paragraph} max-w-[470px] mt-5`}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
            <Link href={url} target="_blank">
              <div className={`justify-end flex-1 flex md:my-0 my-10 relative`}>
                <Image
                
                  src={"/assets/robot2.png"}
                  alt="billings"
                  width={350}
                  height={350}
                  className="relative z-[5] mob-w"
                />
                <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
                <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient" />
                <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
              </div>
            </Link>
            <Link className="mob-l" href={url} target="_blank">
              <div className={`${styles.flexCenter} ss:hidden`}>
                <div
                  className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}
                >
                  <div
                    className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}
                  >
                    <div className={`${styles.flexStart} flex-row`}>
                      <p className="font-poppins font-medium text-[18px] leading-[23px]">
                        <span className="text-gray-50">Get</span>
                      </p>
                      <Image
                        src={arrowUp}
                        alt="arrow"
                        className="w-[23px] h-[23px] object-contain ml-2"
                      />
                    </div>
                    <p className="font-poppins font-medium text-[18px] leading-[23px]">
                      <span className="text-gray-50">Started</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </section>
  );
}
