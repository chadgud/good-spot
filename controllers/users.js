module.exports.renderRegistration = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
        req.flash('success', `Welcome to GoodSpot, ${username}!`);
        res.redirect('/');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back, ${username}!`);
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'See you Later!');
    res.redirect('/');
}