"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import countriesData from "@/app/lib/data";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/app/components/icons";

interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

interface Props {
  selected: Currency;
  setSelected: (currency: Currency) => void;
}

export default function CurrencyDropdown({ selected, setSelected }: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCurrencies = countriesData.currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div ref={ref} className="shrink-0">
      <button
        onClick={toggleDropdown}
        className="flex items-center w-fit gap-2 cursor-pointer"
      >
        <span
          className={`fi fi-${selected.flag.toLowerCase()} w-5 h-4 rounded-none shrink-0 shadow-sm`}
        />
        <span className="text-[17px] font-medium">{selected.code}</span>
        <ChevronDownIcon
          className={`size-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 z-30 mt-2 w-full bg-white dark:bg-[#242424] space-y-3 shadow-md rounded-none px-2 pt-4 h-68.5 border border-black/6 dark:border-white/6 overflow-y-auto max-h-72 thin-scrollbar"
          >
            <div className="relative">
              <div className="absolute left-0 text-lg inset-y-0 flex items-center pl-2 pointer-events-none">
                <SearchIcon className="size-4 text-black/50 dark:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7.5 pr-3 py-2 border border-black/6 dark:border-white/6 rounded-none outline-none transition-all duration-300 ease-in-out focus:border-black/15 dark:focus:border-white/15"
              />
            </div>

            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((currency) => (
                  <li key={currency.code}>
                    <button
                      onClick={() => {
                        setSelected(currency);
                        setOpen(false);
                        setSearchTerm("");
                      }}
                      className="w-full flex items-center justify-between px-1 rounded-none hover:bg-gray-50 dark:hover:bg-white/5.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`fi fi-${currency.flag.toLowerCase()} w-5 h-3.5 rounded-none shrink-0 shadow-sm`}
                        />
                        <span>{currency.code}</span>
                        <span className="text-black/65 dark:text-gray-200 text-sm">
                          {currency.name}
                        </span>
                      </div>
                      {selected.code === currency.code && (
                        <CheckIcon className="size-4 text-[#256F5C]" />
                      )}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-black/65 dark:text-gray-200 text-center py-2">
                  No results
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
