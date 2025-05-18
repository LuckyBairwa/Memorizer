// import passport from 'passport';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import User from '../models/User.model.js';

// // JWT Strategy
// passport.use(new JwtStrategy({
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET
// }, async (payload, done) => {
//   try {
//     const user = await User.findById(payload.sub);
//     return user ? done(null, user) : done(null, false);
//   } catch (err) {
//     done(err, false);
//   }
// }));

// // Google OAuth Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: `${process.env.FRONTEND_URL}/auth/google/callback`
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });
//     if (!user) {
//       user = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         avatar: profile.photos[0].value
//       });
//     }
//     return done(null, user);
//   } catch (err) {
//     done(err, false);
//   }
// }));

// // GitHub OAuth Strategy (similar)
// passport.use(new GitHubStrategy({
//   clientID: process.env.GITHUB_CLIENT_ID,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   callbackURL: `${process.env.FRONTEND_URL}/auth/github/callback`
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ githubId: profile.id });
//     if (!user) {
//       user = await User.create({
//         githubId: profile.id,
//         name: profile.username,
//         avatar: profile._json.avatar_url,
//         email: profile.emails?.[0]?.value // GitHub may not provide email
//       });
//     }
//     return done(null, user);
//   } catch (err) {
//     done(err, false);
//   }
// }));

// export default passport;
