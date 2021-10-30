//Importing Database
const admin = require("firebase-admin");
const db = require("../firebase");
const { collection, getDocs } = require("firebase/firestore");

const bcrypt = require('bcrypt');

const { Router } = require('express');
const router = Router();

router.post('/registrar-usuario', async (req, res) => {
    try {

        let bodyvalidate = JSON.parse(JSON.stringify(req.body));
        if (!bodyvalidate.hasOwnProperty('email')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'email no enviado.'
                })
        }

        if (!bodyvalidate.hasOwnProperty('pass')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'contraseña no enviada.'
                })
        }

        const snapshot = await db.collection('usuarios').where('email', '==', req.body.email).get();
        if (!snapshot.empty) {
            return res
                .status(500).json({
                    ok: false,
                    err: 'usuario con ese email ya esta registrado.'
                })
        }

        let body = req.body;
        const nuevousuario = {
            email: body.email,
            pass: bcrypt.hashSync(body.pass, 10),
            role: body.role //0 Admin 1 usuario final
        }

        // agrego un nuevo usuario (add collection)
        const data = await db.collection('usuarios').add(nuevousuario);

        res.json({
            ok: true,
            msg: 'usuario Insertado con exito',
            id: data.id,
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error creando el usuario',
            err: error
        })
    }
});

router.post('/login-usuario', async (req, res) => {
    try {

        let bodyvalidate = JSON.parse(JSON.stringify(req.body));
        if (!bodyvalidate.hasOwnProperty('email')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'email no enviado.'
                })
        }

        if (!bodyvalidate.hasOwnProperty('pass')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'contraseña no enviada.'
                })
        }

        const snapshot = await db.collection('usuarios').where('email', '==', req.body.email).get();

        // Verifica que exista un usuario con el mail escrito por el usuario.
        if (snapshot.empty) {
            return res
                .status(500).json({
                    ok: false,
                    err: 'Usuario o contraseña incorrectos.'
                })
        }

        let body = req.body;
        let userId;
        let userEmail;
        let userRole;
        let passwordEncypted;

        //Tomo los datos del usuario de la base de datos
        snapshot.forEach(doc => {
            userId = doc.id;
            userEmail = doc.data().email;
            userRole = doc.data().role;
            passwordEncypted = doc.data().pass;
        });

        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        if (!bcrypt.compareSync(body.pass, passwordEncypted)) {
            return res.status(400).json({
                ok: false,
                err: "Usuario o contraseña incorrectos"
            });
        }

        let arrayData = [];
        //obtengo los datos buscados
        arrayData.push({
            id: userId,
            email: userEmail,
            role: userRole
        });

        res.json({
            ok: true,
            msg: 'Inicio de sesion con exito',
            producto: arrayData
        })


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error buscando el usuario',
            err: error
        })
    }

});

module.exports = router;