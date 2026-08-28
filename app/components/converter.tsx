"use client";

import { motion } from "framer-motion";
import posthog from "posthog-js";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";

import countriesData from "@/app/lib/data";
import { RightLeftIcon } from "@/app/components/icons";
import { useDetectedCurrency } from "@/app/hooks/useDetectedCurrency";
import { useRelativeTime } from "@/app/hooks/useRelativeTime";
import { computeRate, type RatesMap } from "@/app/lib/rates";
import {
  CONVERSION_DECIMAL_PLACES,
  RATE_DECIMAL_PLACES,
  PH_EVENTS,
} from "@/app/lib/constants";

const CurrencyDropdown = dynamic(
  () => import("@/app/components/currencyDropdown"),
);
// Recharts touches window/DOM measurement directly — same reasoning as
// the original, just now explicit instead of implicit via React.lazy.
const CurrencyHistoryChart = dynamic(
  () => import("@/app/components/historyChart"),
  { ssr: false },
);

const DEFAULT_FROM = countriesData.currencies[0];
const DEFAULT_TO = countriesData.currencies[1];
const DEFAULT_AMOUNT = "100";
const STEPS = ["step1", "step2", "step3"] as const;

interface Props {
  initialRates: RatesMap | null;
  fetchedAt: string | null;
}

export default function Converter({ initialRates, fetchedAt }: Props) {
  const { t, ready } = useTranslation();

  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM);
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [swapRotation, setSwapRotation] = useState(0);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useDetectedCurrency(setToCurrency);

  // No isLoading state anymore — rates arrive with the initial HTML
  // instead of being fetched after mount, so there's nothing to spin on
  // for the main rate. (The chart keeps its own loading state below —
  // that's a separate, genuinely client-side fetch per date range.)
  const rate = initialRates
    ? computeRate(initialRates, fromCurrency.code, toCurrency.code)
    : null;

  const parsedAmount = parseFloat(amount);
  const convertedAmount =
    rate && amount.trim() && !isNaN(parsedAmount)
      ? (parsedAmount * rate).toFixed(CONVERSION_DECIMAL_PLACES)
      : "";

  const relativeTime = useRelativeTime(fetchedAt ? new Date(fetchedAt) : null);

  useEffect(() => {
    if (!rate || !amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const converted = parsedAmount * rate;

    debounceTimerRef.current = setTimeout(() => {
      posthog.capture(PH_EVENTS.currencyConverted, {
        from_currency: fromCurrency.code,
        to_currency: toCurrency.code,
        amount: parsedAmount,
        converted_amount: converted,
        rate: rate,
      });
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // Keep derived analytics values inside the effect so the debounced callback
    // cannot close over a stale formatted string.
  }, [amount, parsedAmount, fromCurrency.code, toCurrency.code, rate]);

  function handleAmountChange(raw: string) {
    setAmount(raw.replace(/,/g, ""));
  }

  const formatDisplayAmount = (val: string) => {
    const [integer, decimal] = val.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal !== undefined
      ? `${formattedInteger}.${decimal}`
      : formattedInteger;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanedValue = e.target.value.replace(/[^0-9.]/g, "");

    const parts = cleanedValue.split(".");
    if (parts.length > 2) {
      cleanedValue = parts[0] + "." + parts.slice(1).join("");
    }

    handleAmountChange(cleanedValue);
  };

  function handleSwap() {
    const nextFrom = toCurrency;
    const nextTo = fromCurrency;

    setFromCurrency(nextFrom);
    setToCurrency(nextTo);
    setSwapRotation((prev) => prev + 180);

    posthog.capture(PH_EVENTS.currencySwapped, {
      from_currency: nextFrom.code,
      to_currency: nextTo.code,
    });
  }

  return (
    <>
      <section className="pb-16">
        <div className="max-w-2xl mx-auto gap-y-2 text-center">
          <h2 className="text-center text-lg">
            {t("welcome.welcomeLine1")}
            <span className="font-bold text-lg">sedie,</span>
            <br />
            {t("welcome.welcomeLine2")}
          </h2>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-16 pb-10">
        <div className="mx-auto max-w-sm sm:max-w-md px-2 sm:px-0">
          <h3 className="text-center text-[#256F5C] text-2xl font-bold mb-8">
            {t("welcome.guideTitle")}
          </h3>

          <div className="grid grid-cols-1 gap-7">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className="px-7 py-7.5 flex flex-col justify-center items-center border-2 border-black/6 dark:border-white/6 rounded-none space-y-6 shadow-lg"
              >
                <h3 className="text-3xl font-frozen">{index + 1}.</h3>
                <h4 className="text-xl font-bold">
                  {t(`guide.${step}.title`)}
                </h4>
                <p className="text-black/65 dark:text-gray-200 text-center">
                  {ready ? t(`guide.${step}.desc`) : "…"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Converter */}
      <section id="converter" className="pt-12">
        <div className="py-6 border-0 flex flex-col items-center gap-3">
          <h3 className="text-center text-2xl text-[#256F5C] font-bold my-3">
            {t("converterWords.title")}
          </h3>

          <div className="w-full max-w-md">
            <h4 className="text-lg text-center pb-9">
              {t("converterWords.line1")}{" "}
              <span className="font-medium text-xl">
                {t("converterWords.highlight1")}
              </span>{" "}
              {t("converterWords.line2")}
              <br />
              <span className="font-medium text-xl text-[#256F5C]">
                {t("converterWords.highlight2")}
              </span>
              .
            </h4>
          </div>

          {/* From currency + amount */}
          <div className="w-full max-w-sm sm:max-w-md px-2 sm:px-0">
            <label className="block text-end text-[1.0625rem] text-black/65 dark:text-gray-200 mb-1.5">
              {t("converterWords.amount")}
            </label>
            <div className="relative flex items-center justify-between border-2 gap-5 border-black/6 dark:border-white/6 rounded-none px-3 py-3.75 shadow-lg">
              <CurrencyDropdown
                selected={fromCurrency}
                setSelected={setFromCurrency}
              />
              <div className="w-[65%]" dir="ltr">
                <input
                  inputMode="decimal"
                  aria-label="Enter amount to convert"
                  value={formatDisplayAmount(amount)}
                  onChange={handleInputChange}
                  className="outline-none border-none w-full bg-transparent text-lg text-end font-medium appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none placeholder:text-lg"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Swap button */}
          <motion.button
            onClick={handleSwap}
            whileHover={{ scale: 1.06 }}
            animate={{ rotate: swapRotation }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="text-2xl my-7 items-center bg-[#256F5C] cursor-pointer rounded-full p-2 justify-center flex"
            aria-label="Swap currencies"
          >
            <RightLeftIcon className="size-4 text-white" />
          </motion.button>

          {/* To currency + converted amount */}
          <div className="w-full max-w-sm sm:max-w-md px-2 sm:px-0">
            <label className="block text-end text-[1.0625rem] text-black/65 dark:text-gray-200 mb-2">
              {t("converterWords.convertedFigure")}
            </label>
            <div className="relative flex items-center justify-between gap-5 border-2 border-black/6 dark:border-white/6 rounded-none px-3 py-3.75 shadow-lg">
              <CurrencyDropdown
                selected={toCurrency}
                setSelected={setToCurrency}
              />

              <div className="w-[70%] min-w-0" dir="ltr">
                <NumericFormat
                  value={convertedAmount}
                  displayType="input"
                  thousandSeparator=","
                  readOnly={true}
                  className="w-full text-end text-lg font-medium block appearance-none whitespace-nowrap overflow-x-auto no-scrollbar focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Exchange rate display */}
          <div>
            <h5 className="text-center text-[1.375rem] font-bold mt-12">
              {t("converterWords.rate")}
            </h5>
            <p className="text-center text-xl font-normal mt-1.5">
              {rate ? (
                <>
                  {fromCurrency.symbol}1.00 {fromCurrency.code} ={" "}
                  {toCurrency.symbol}
                  <span className="font-bold">
                    {rate.toFixed(RATE_DECIMAL_PLACES)}
                  </span>{" "}
                  {toCurrency.code}
                </>
              ) : (
                "Could not fetch rate."
              )}
            </p>
            {rate && relativeTime && (
              <p className="text-center font-light text-black/65 dark:text-gray-200 mt-4 mb-2">
                {relativeTime}
              </p>
            )}
          </div>

          <CurrencyHistoryChart
            base={fromCurrency.code}
            target={toCurrency.code}
            currentRate={rate}
          />
        </div>
      </section>
    </>
  );
}
