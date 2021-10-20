import signUpSchema from './validateSignUp.js';

const postUser = (req, res) => {
    const { user } = req.body;
    const { error } = signUpSchema.validate(req.body);

    if (!!error) return res.sendStatus(400);
    return res.send('Usuário Postato');
}

export { postUser }