const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { createConversation, getAllFriends, saveChat, getAllChat } = require('../controllers/conversation')

ROUTE.post('/create-conversation/:email',authorize(ROLES.User), createConversation);
ROUTE.get('/get-all-conversation',authorize(ROLES.User), getAllFriends);
ROUTE.post('/start-chat',authorize(ROLES.User), saveChat);
ROUTE.get('/get-all-chat/:chanel_id',authorize(ROLES.User), getAllChat);



module.exports = ROUTE;
