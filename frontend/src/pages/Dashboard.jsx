import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../components/loading";
import Info from "../components/info";
import Stats from "../components/stats";
import { Chart } from "../components/chart";
import DoughnutChart from "../components/piechart";
import api from "../libs/apiCall";
import Accounts from "../components/accounts";
import RecentTransactions from "../components/recent-transactions";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataboardStats = async () => {
    const URL = `/transaction/dashboard`;

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await api.get(URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data:", res.data);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Something unexpected happened. Try again later."
      );
      if (err?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDataboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-0 md:px-5 2xl:px-20">
      <Info title="Dashboard" subtitle={"Monitor your financial activities"} />
      <Stats
        dt={{
          balance: data?.avaliableBalance,
          income: data?.totalIncome,
          expense: data?.totalExpense,
        }}
      />

      <div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
        <Chart data={data?.charData} />
        {data?.totalIncome > 0 && (
          <DoughnutChart
            df={{
              balance: data?.avaliableBalance,
              income: data?.totalIncome,
              expense: data?.totalExpense,
            }}
          />
        )}
      </div>

      <div className="flex flex-col reverse gap-0 md:flex row md:gap-10 2xl:gap-20">
        <RecentTransactions data={data?.lastTransactions} />
        {data?.lastAccount?.legth > 0 && <Accounts data={data?.lastAccount} />}
      </div>
    </div>
  );
};

export default Dashboard;
