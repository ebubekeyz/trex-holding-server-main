const createTokenUser = (user) => {
  return {
    fullName: user.fullName,
    username: user.username,
    country: user.country,
    email: user.email,
    city: user.city,
    status: user.status,
    zip: user.zip,
    state: user.state,
    phone: user.phone,
    referralId: user.referralId,
    userId: user._id,
    role: user.role,
  };
};

module.exports = createTokenUser;
