const jwt = require("jsonwebtoken");
const redisClient = require("./redis").redisClient;

const handleSignin = (db, bcrypt, req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }

  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((users) => users[0])
          .catch((err) => {
            console.error(err);
            Promise.reject("unable to get user");
          });
      } else {
        return Promise.reject("wrong credentials");
      }
    })
    .catch((err) => Promise.reject(err));
};

const getAuthTokenId = (authorization, res) => {
  return redisClient
    .get(authorization)
    .then((id) => {
      if (!id) {
        return res.status(401).json("Unauthorized");
      } else {
        return res.json({ id });
      }
    })
    .catch(console.error);
};

const createSession = (user) => {
  const { id, email } = user;
  const token = generateToken(email);

  return redisClient
    .set(token, id)
    .then(() => {
      return { success: true, userId: id, token };
    })
    .catch(console.error);
};

const generateToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const handleSigninWithAuth = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(authorization, res)
    : handleSignin(db, bcrypt, req)
        .then((data) =>
          data.id && data.email ? createSession(data) : Promise.reject(data)
        )
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  handleSigninWithAuth: handleSigninWithAuth,
};
