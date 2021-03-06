const express = require('express')
const mongoose = require('mongoose')

const pkg = require('../../../package.json')

const apiRouter = express.Router()

const mongoConnectionStatuses = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
}

module.exports = (app, config) => {
  /**
   * @api {get} / Version
   * @apiName Version
   * @apiGroup Main
   *
   * @apiSuccess {String} name      Name of API
   * @apiSuccess {String} version   Version of API
   * @apiSuccess {String} homepage  Homepage of project
   * @apiSuccess {Object} instance  Instance information
   * @apiSuccess {String} instance.url  Instance base URL
   * @apiSuccess {String} instance.api  Instance base API URL
   *
   * @apiExample {curl} Example usage:
   *     curl -i https://mcpr.io/api/v1
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "name": "MCPR API",
   *       "version": "0.0.1",
   *       "homepage": "https://mcpr.io",
   *       "instance": {
   *          "url": "https://mcpr.io",
   *          "api": "https://mcpr.io/api/v1"
   *       }
   *     }
   */
  apiRouter.get('/', (req, res) => {
    return res.json({
      name: 'MCPR API',
      version: pkg.version,
      homepage: pkg.homepage,
      instance: {
        url: config.externalUrl,
        api: `${config.externalUrl}/api/v1`
      }
    })
  })

  /**
   * @api {get} /healthcheck Health Check
   * @apiName HealthCheck
   * @apiGroup Main
   *
   * @apiSuccess {String} nodeCheck       Status of the Node check.
   * @apiSuccess {String} dbCheck       Status of the database connection.
   *
   * @apiExample {curl} Example usage:
   *     curl -i https://mcpr.io/api/v1/healthcheck
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "nodeCheck": {
   *          "status": "ok"
   *       },
   *       "dbCheck": {
   *          "status": "connected"
   *       }
   *     }
   */
  apiRouter.get('/healthcheck', (req, res) => {
    let status = 200
    let mongoConnection

    const setStatus = newStatus => {
      if (newStatus > status) {
        status = newStatus
      }
    }

    try {
      mongoConnection =
        mongoConnectionStatuses[mongoose.connection.readyState] || 'unknown'

      if (mongoConnection !== 'connected') {
        setStatus(500)
      }

      mongoose.connection.db.admin().ping((err, result) => {
        if (err || !result) {
          setStatus(500)
        }
      })
    } catch (err) {
      setStatus(500)
      if (!mongoConnection) {
        mongoConnection = 'error'
      }
      console.log(err)
    }

    return res.json({
      nodeCheck: {
        status: 'ok'
      },
      dbCheck: {
        status: mongoConnection
      }
    })
  })

  apiRouter.use('/plugins', require('./plugins')(config))
  apiRouter.use('/users', require('./users')(config))
  apiRouter.use('/versions', require('./versions')(config))

  return apiRouter
}
