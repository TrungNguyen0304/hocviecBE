const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: "Người dùng không tồn tại." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Mật khẩu không đúng." });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8001/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({ email: profile.emails[0].value });
            if (existingUser) return done(null, existingUser);

            const newUser = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: "google-oauth2",
                role: "employee"
            });
            await newUser.save();
            done(null, newUser);
        } catch (err) {
            done(err, false);
        }
    }));
