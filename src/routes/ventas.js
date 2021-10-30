//Importing Database
const admin = require("firebase-admin");
const db = require("../firebase");
const { collection, getDocs } = require("firebase/firestore");

const { Router } = require('express');
const router = Router();

router.get('/listar-ventas', async (req, res) => {
    try {
        // get collection
        const vent = db.collection('Ventas');
        const snapshot = await vent.get();
        const arrayData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        res.json({
            ok: true,
            msg: 'Listado exitoso',
            ventas: arrayData,
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error obteniendo las ventas',
            err: error
        })
    }
});

router.get('/listar-venta', async (req, res) => {
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
        // busco esa venta en la bd
        const snapshot = await db.collection('Ventas').doc(docId).get();
        if (!snapshot.exists) {
            return res
                .status(404).json({
                    ok: false,
                    err: 'Venta con ID ' +  docId + ' no encontrada'
                })
        }
        let arrayData = [];
        //obtengo los datos buscados
        arrayData.push({
            id: snapshot.id,
            total: snapshot.data().total,
            idCliente: snapshot.data().idCliente,
            cliente: snapshot.data().cliente,
            desgloceventa: snapshot.data().desgloceventa
        });

        res.json({
            ok: true,
            msg: 'Venta encontrada con exito',
            venta: arrayData
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error buscando la venta',
            err: error
        })
    }
});

router.post('/nueva-venta', async (req, res) => {
    try {

        let bodyvalidate = JSON.parse(JSON.stringify(req.body));
        if (!bodyvalidate.hasOwnProperty('idCliente')) {
            return res
                .status(400).json({
                    ok: false,
                    err: 'idCliente no enviado.'
                })
        }

        let body = req.body;
        const nuevaventa = {
            idCliente: body.idCliente,
            cliente: body.cliente,
            desgloceventa: body.desgloceventa,
            total: body.total
        }

        // agrego un nueva venta (add collection)
        const data = await db.collection('Ventas').add(nuevaventa);

        res.json({
            ok: true,
            msg: 'Venta Insertada',
            id: data.id,
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error insertando la venta',
            err: error
        })
    }
});

router.delete('/eliminar-venta', async (req, res) => {
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
        const snapshot = await db.collection('Ventas').doc(docId).get();
        if (!snapshot.exists) {
            return res
                .status(404).json({
                    ok: false,
                    err: 'venta con id ' +  docId + ' no encontrada'
                })
        }
        let arrayData = [];
        //obtengo los datos buscados
        arrayData.push({
            id: snapshot.id,
            total: snapshot.data().total,
            idCliente: snapshot.data().idCliente,
            cliente: snapshot.data().cliente,
            desgloceventa: snapshot.data().desgloceventa
        });

        // borro esa venta de la base de datos
        const ventDeleted = await db.collection('Ventas').doc(docId).delete()

        res.json({
            ok: true,
            msg: 'Venta Eliminada',
            ID: docId,
            venta: arrayData
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'ocurrio un error eliminado la venta',
            err: error
        })
    }
});

module.exports = router;