maxmemory-policy allkeys-lru

tcp-keepalive 30

io-threads-do-reads yes
io-threads ${REDIS_CONN}

appendonly yes
appendfsync always

requirepass ${REDIS_SERVER_PASS}

port ${REDIS_PORT}

# ACL rules for users
user ${REDIS_CLIENT_USER} on >${REDIS_CLIENT_PASS} ~* +@read +@write +ping +quit +info