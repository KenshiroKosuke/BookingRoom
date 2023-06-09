import { User } from '../models/User.js'
// @desc    register user
// @route   POST /api/v1/auth/register
// @access  public
export async function register(req, res, next) {
    console.log(req.body);
    try {
        const { name, email, password, role } = req.body;

        // create user
        const user = await User.create({
            name,
            email,
            password,
            role
        })

        // create token
        // const token = user.getSignedJWT();
        // res.status(200).json({ success: true, token });
        sendTokenResponse(user, 200, res)
        console.log("New user created")
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
}

// @desc    login user
// @route   POST /api/v1/auth/login
// @access  public
export async function login(req, res, next) {
    try {
        const { name, password } = req.body;
        // validate
        if (!name || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Please enter an name and password'
            })
        }
        // check for user (get user)
        // get only hashed password
        const user = await User.findOne({ 'name': name }, 'password')
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }
        // check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }
        // Create token
        // const token = user.getSignedJWT();
        // res.status(200).json({success:true,token})
        sendTokenResponse(user, 200, res)
        console.log(`User has logined`)
    } catch (err) {
        return res.status(401).json({success:false, msg:'Cannot convert name or password to string'});
    }
}

const sendTokenResponse = (user, statusCode, res) => {
    // Create cookies for when you register/login
    //  set token
    const token = user.getSignedJWT();
    //  set cookies options; there're many options here
    //  https://expressjs.com/en/api.html#res.cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

// @desc    get current logged-in user
// @route   POST /api/v1/auth/me
// @access  Private
export async function getMe(req, res, next) {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
}

// @desc    log user out / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
export async function logout(req, res, next) {
    // res.clearCookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
}