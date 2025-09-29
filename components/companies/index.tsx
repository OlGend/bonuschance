"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import DOMPurify from "isomorphic-dompurify";
import { mergeTracking, type Tracking } from "../../components/lib/useTracking";
type Brand = {
  brand: { brand_logo?: string };
  content: { value?: string; our_link?: string };
};
export default function Companies({
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
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="border-none -my-2 pt-0 flex justify-center">
      <div className="container">
        <div>
          <Slider {...settings}>
            {displayed.map((item, idx) => {
              if (!item?.brand?.brand_logo || !item?.content?.our_link)
                return null;

              const imageSrc = `/images/brands/${item.brand.brand_logo}.png`;
              const url = buildTrackedUrl(item.content.our_link);

              return (
                <div key={idx}>
                  <Link href={url} target="_blank">
                    <Image
                      src={imageSrc}
                      alt={imageSrc}
                      width={130}
                      height={65}
                      className="w-auto"
                    />
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}
