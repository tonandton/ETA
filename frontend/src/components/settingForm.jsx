import React, { Fragment, useEffect, useState } from "react";
import useStore from "../store";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { BsChevronExpand } from "react-icons/bs";
import { BiCheck, BiLoader } from "react-icons/bi";
import { Form, FormProvider, useForm } from "react-hook-form";
import { fetchCountries } from "../libs";
import Input from "./ui/input";
import api from "../libs/apiCall";
import { Button } from "./ui/button";
import { toast } from "sonner";

const SettingsForm = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { ...user } });

  const [selectedCountry, setSelectedCountry] =
    useState({
      country: user?.country,
      currency: user?.currency,
    }) || "";

  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      setLoading(true);

      const newData = {
        ...data,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      const { data: res } = await api.put(`/user/${user?.id}`, newData);
      // const { data: res } = await api.put(`/user`, newData);

      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));

        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Sometthing went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  useEffect(() => {
    getCountriesList();
  }, []);

  useEffect(() => {
    if (user && user.firstname) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
      });

      setSelectedCountry({
        country: user.country,
        currency: user.currency,
      });
    }
  }, [user, reset]);

  const Countries = () => {
    const [query, setQuery] = useState("");

    const filteredCountries =
      query === ""
        ? countriesData
        : countriesData.filter((country) =>
            (country?.country || "")
              .toLowerCase()
              // .replace(/\s+/g, "")
              .includes(
                query.toLowerCase()
                // .replace(/\s+/g, "")
              )
          );

    return (
      <div className="w-full">
        <Combobox
          value={selectedCountry}
          onChange={(val) => {
            setSelectedCountry(val);
            setQuery("");
          }}
        >
          <div className="relative mt-1">
            <div className="">
              <ComboboxInput
                className="inputStyles"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                displayValue={(country) => query || country?.country || ""}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <BsChevronExpand className="text-gray-400" />
              </ComboboxButton>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              // afterLeave={() => setQuery("")}
            >
              <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-4">
                {filteredCountries.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                    Nothing found.
                  </div>
                ) : (
                  filteredCountries?.map((country, index) => (
                    <ComboboxOption
                      key={country.country + index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-violet-600/20 text-white"
                            : "text-gray-900"
                        }`
                      }
                      value={country}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={country?.flag}
                              alt={country.country}
                              className="w-8 h-5 rounded-sm object-cover"
                            />
                            <span
                              className={`block truncate text-gray-700 dark:text-gray-500 ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {country?.country}
                            </span>
                          </div>
                          {selected ? (
                            <span
                              className={`absoute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <BiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <Input
            name="firstname"
            label="First Name"
            type="text"
            placeholder={user.firstname || "first name"}
            register={register("firstname", {
              required: "First Name is required!",
            })}
            error={errors.firstname ? errors.firstname.message : ""}
            className="inputStyles"
          />
        </div>
        <div className="w-full">
          <Input
            name="lastname"
            label="Last Name"
            type="text"
            placeholder={user.lastname}
            // {...register("lastname")}
            register={register("lastname", {
              required: "Last Name is required!",
            })}
            error={errors.lastname ? errors.lastname.message : ""}
            className="inputStyles"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder={user.email}
            register={register("email", {
              required: "Email is required!",
            })}
            error={errors.email ? errors.email.message : ""}
            className="inputStyles"
          />
        </div>
        <div className="w-full">
          <Input
            name="phone"
            label="Phone"
            type="text"
            placeholder={user.contact}
            // {...register("phone")}
            register={register("contact", {
              required: "Phone is required!",
            })}
            error={errors.phone ? errors.phone.message : ""}
            className="inputStyles"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <span className="labelStyles">Country</span>
          <Countries />
        </div>
        <div className="w-full">
          <span className="labelStyles">Currency</span>
          <select className="inputStyles">
            <option>{selectedCountry?.currency || user?.country}</option>
          </select>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-10">
        <div className="">
          <p className="text-lg text-black dark:text-gray-400 font--semibold">
            Appearance
          </p>
          <span className="labelStyles">
            Customize how your theme looks on your device.
          </span>
        </div>

        <div className="w-28 md:w-40">
          <select
            className="inputStyles"
            defaultValue={theme}
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pb-10">
        <div>
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Language
          </p>
          <span className="labelStyles">
            Custoomize what language you want to use.
          </span>
        </div>

        <div className="w-28 md:w-40">
          <select className="inputStyles">
            <option value="English">English</option>
            <option value="Thai">ไทย</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          loading={loading}
          type="reset"
          className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700"
        >
          Reset
        </Button>
        <Button
          loading={loading}
          type="submit"
          className="px-8 bg-violet-800 text-white"
        >
          {loading ? <BiLoader className="animate-spin text-white" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
