import React from "react";
import { Card } from "@mui/material";
import Link from "next/link";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { checkout, openPortal } from "@/src/utils/stripe";
const PricingPage = ({ pricing, plan }) => {
  let { userId, isSignedIn } = useAuth();
  const { push } = useRouter();

  let onCheckout = async (priceId) => {
    let session = await checkout(priceId, window.location.origin, userId);
    push(session.url);
  };

  const onOpenPortal = async () => {
    let session = await openPortal(window.location, userId);
    push(session.url);
  };

  return (
    <div className="m-8">
      <div className="my-8">
        <h1 className="text-center text-slate-600 mb-4">Start Tracking Items</h1>
        <h3 className="text-center text-slate-500 font-normal">Choose a plan that works best for you</h3>
      </div>
      <div className="flex gap-6 w-fit mx-auto flex-wrap justify-center">
        <PriceCard
          data={pricing.find((pricing) => pricing.name === "Free")}
          userId={userId}
          plan={plan}
          isSignedIn={isSignedIn}
        />
        <PriceCard
          data={pricing.find((pricing) => pricing.name === "Basic")}
          plan={plan}
          isSignedIn={isSignedIn}
          onCheckout={onCheckout}
          onOpenPortal={onOpenPortal}
        />
        <PriceCard
          data={pricing.find((pricing) => pricing.name === "Pro")}
          plan={plan}
          isSignedIn={isSignedIn}
          onCheckout={onCheckout}
          onOpenPortal={onOpenPortal}
        />
      </div>
    </div>
  );
};

const PriceCard = ({ data, plan, isSignedIn, onCheckout, onOpenPortal }) => {
  let onAction = () => {
    if (plan === "Free") {
      onCheckout(data.priceId);
    } else {
      onOpenPortal();
    }
  };
  return (
    <Card variant="outlined" className="shadow-lg px-5 py-6 relative flex flex-col gap-4 w-[280px]">
      {data.name === "Basic" && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>}
      {data.name === "Basic" && (
        <div className="absolute top-4 right-2 w-fit p-1 bg-blue-100 text-blue-500 rounded-sm shadow-sm text-xs">
          Popular
        </div>
      )}
      <div>
        <h3 className="text-slate-600">{data.name}</h3>
        <h5 className="text-slate-400 font-normal">{data.shortDescription}</h5>
      </div>
      <h2 className="text-5xl font-light text-slate-500">
        {data.price === "Free" ? (
          <span className="">Free</span>
        ) : (
          <>
            <span className="text-5xl">$</span>
            <span className="font-medium ml-1 mr-2 text-5xl text-slate-600">{data.price}</span>
            <span className="text-base">per month</span>
          </>
        )}
      </h2>
      {data.price === "Free" || !isSignedIn ? (
        <Link href={!isSignedIn ? "/sign-up" : ""} passHref className="w-full">
          <Button className="w-full" variant="contained" color="secondary" disabled={isSignedIn}>
            {data.action}
          </Button>
        </Link>
      ) : (
        <Button onClick={onAction} className="w-full" variant="contained" color="secondary">
          {plan === "Free" || !plan ? data.action : "Manage"}
        </Button>
      )}
      <div className="mt-4">
        <h4 className="text-slate-600">Features</h4>
        <ul className="list-none mt-3">
          {data.features.map((feature, index) => {
            return (
              <li key={index} className="flex gap-2 items-center text-slate-400 my-2">
                <CheckIcon className="text-blue-500" />
                {feature}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default PricingPage;
