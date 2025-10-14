import dotenv from "dotenv";
dotenv.config();

const proxies = [process.env.PROXY_1, process.env.PROXY_2].filter(Boolean);

export const getRandomProxy = () => {
  if (proxies.length == 0) return null;
  return proxies[Math.floor(Math.random() * proxies.length)];
};
