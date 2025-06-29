import colors from "colors";

export const logger = (req, res, next) => {
  const colorMethods = {
    GET: "green",
    PUT: "yellow",
    DELETE: "red",
    POST: "blue",
  };

  const color = colorMethods[req.method] || white;
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`[
      color
    ]
  );
  next();
};
