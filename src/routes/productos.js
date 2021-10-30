//Importing Database
const admin = require("firebase-admin");
const db = require("../firebase");
const { collection, getDocs } = require("firebase/firestore");

const { Router } = require('express');
const router = Router();

router.get('/listar-productos', async (req, res) => {
    try {
        // get collection
        const prod = db.collection('productos');
        const snapshot = await prod.get();
        const arrayData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        res.json({
            ok: true,
            msg: 'Listado exitoso',
            productos: arrayData,
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error obteniendo los productos',
            err: error
        })
    }
});

router.get('/listar-producto', async (req, res) => {
    try {
        let docId = req.query.id;
        let bodyvalidate = JSON.parse(JSON.stringify(req.query));
        if (!bodyvalidate.hasOwnProperty('id')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'id no enviado.'
                })
        }
        // busco ese producto en la bd
        const snapshot = await db.collection('productos').doc(docId).get();
        if (!snapshot.exists) {
            return res
                .status(404).json({
                    ok: false,
                    err: 'Producto con id ' + docId + ' no fue encontrado'
                })
        }
        let arrayData = [];
        //obtengo los datos buscados
        arrayData.push({
            id: snapshot.id,
            valorUnitario: snapshot.data().valorUnitario,
            Descripcion: snapshot.data().Descripcion,
            ID: snapshot.data().ID,
            Disponibilidad: snapshot.data().Disponibilidad
        });

        res.json({
            ok: true,
            msg: 'Producto encontrado con exito',
            producto: arrayData
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error buscando el producto',
            err: error
        })
    }
});

router.post('/nuevo-producto', async (req, res) => {
    try {

        let bodyvalidate = JSON.parse(JSON.stringify(req.body));
        if (!bodyvalidate.hasOwnProperty('ID')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'ID no enviado.'
                })
        }

        const productosSameID = await db.collection('productos').where('ID', '==', req.body.ID).get();
        if (!productosSameID.empty) {
            return res
                .status(500).json({
                    ok: false,
                    err: 'ID duplicado.'
                })
        }

        let body = req.body;
        const nuevoproducto = {
            ID: body.ID,
            Descripcion: body.Descripcion,
            Disponibilidad: body.Disponibilidad,
            valorUnitario: body.valorUnitario
        }

        // agrego un nuevo producto (add collection)
        const data = await db.collection('productos').add(nuevoproducto);

        res.json({
            ok: true,
            msg: 'Producto Insertado',
            id: data.id,
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error insertando el producto',
            err: error
        })
    }
});

router.delete('/eliminar-producto', async (req, res) => {
    try {
        let docId = req.body.id;

        let bodyvalidate = JSON.parse(JSON.stringify(req.body));
        if (!bodyvalidate.hasOwnProperty('id')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'id no enviado.'
                })
        }
        // busco ese producto en la bd
        const snapshot = await db.collection('productos').doc(docId).get();
        if (!snapshot.exists) {
            return res
                .status(404).json({
                    ok: false,
                    err: 'Producto con id ' + docId + ' no encontrado'
                })
        }
        let arrayData = [];
        //obtengo los datos buscados
        arrayData.push({
            id: snapshot.id,
            valorUnitario: snapshot.data().valorUnitario,
            Descripcion: snapshot.data().Descripcion,
            ID: snapshot.data().ID,
            Disponibilidad: snapshot.data().Disponibilidad
        });

        // borro ese producto de la base de datos
        const prodDeleted = await db.collection('productos').doc(docId).delete()

        res.json({
            ok: true,
            msg: 'Producto Eliminado',
            id: docId,
            producto: arrayData
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error eliminado el producto',
            err: error
        })
    }
});

module.exports = router;