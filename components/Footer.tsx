import styles from "@/styles/style";
import { logo } from "@/public/assets";
import Link from "next/link";
import { footerLinks, socialMedia } from "@/constants";
import Image from "next/image";
const Footer: React.FC = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
    <div className={`${styles.flexCenter} md:flex-row flex-col mb-8 w-full`}>
      <div className="flex-1 flex flex-col justify-start mr-10">
        <Image
          src={logo}
          alt="hoobank"
          className="w-[266px] h-[72px] object-contain"
        />
        <p className={`${styles.paragraph} mt-4 max-w-[310px]`}>
          A smarter way to get your casino bonus — simple, instant, and
          guaranteed.
        </p>
        <div className="form flex justify-between mt-4 max-w-[280px]">
          <input
            value={"Enter your email"}
            className="flex text-primay mt-auto justify-center text-center items-center gap-1.5 text-darkmode border max-w-[200] px-1.5 py-1 border-primary py-1 px-3 rounded-lg sm:text-18 text-16 font-medium"
            type="text"
          />
          <button className="ml-3 flex mt-auto justify-center text-center items-center gap-1.5 text-darkmode bg-cyan-600 hover:bg-cyan/80 border border-white py-1 px-3 rounded-lg sm:text-18 text-16 font-medium">
            Subscribe
          </button>
        </div>
      </div>
      <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-auto mt-10">
        {footerLinks.map((footerLink) => (
          <div
            key={footerLink.id}
            className="flex flex-col ss:my-0 my-4 mix-w-[150px"
          >
            <h4
              className={`font-poppins font-medium text-[18px] leading-[27px] text-white`}
            >
              {footerLink.title}
            </h4>
            <ul className="list-none mt-4 flex">
              <li
                className={`mr-3 font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer "mb-4" : "mb-0"
                  }`}
              >
                <Link className="mr-2" href={`/responsible-gaming`}>
                  Responsible Gaming
                </Link>
              </li>
              <li
                className={`mr-3 font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer "mb-4" : "mb-0"
                  }`}
              >
                <Link className="mr-2" href={`/terms-and-conditions`}>
                  Terms and conditions
                </Link>
              </li>
              <li
                className={`mr-3 font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer "mb-4" : "mb-0"
                  }`}
              >
                <Link className="mr-2" href={`/privacy-policy`}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full flex justify-center items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright © 2025, bonus-chance.com. All rights reserved.
      </p>
    </div>
  </section>
);

export default Footer;
