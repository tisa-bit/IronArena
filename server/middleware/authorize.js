import Unauthorized from "../helper/exception/unauthorized.js";

export default function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleId)) {
      throw new Unauthorized("Access denied.");
    }
    return next();
  };
}
