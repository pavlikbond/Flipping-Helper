export const checkout = async (priceId, location, userId) => {
  return fetch("/api/stripe/checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      priceId: priceId,
      successURL: `${location}/tracker`,
      cancelURL: `${location}/pricing`,
      userId: userId,
    }),
  })
    .then((res) => res.json())
    .then((session) => {
      // Redirect to Checkout
      return session;
    });
};

export const openPortal = async (location, userId) => {
  return fetch("/api/stripe/portal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      returnURL: `${location}`,
    }),
  })
    .then((res) => res.json())
    .then((session) => {
      // Redirect to Checkout
      return session;
    });
};
