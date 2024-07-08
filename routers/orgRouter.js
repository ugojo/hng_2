const express = require('express')
const { getOrg, getOrgId, updateOrg, createOrg } = require('../controllers/orgController')
const authVerify = require('../middlewares/authVerify')

const router = express.Router()

router.use(authVerify)
router.get('/', getOrg)
router.get('/:orgId/', getOrgId)
router.post('/', createOrg)
router.patch('/', updateOrg)


module.exports = router