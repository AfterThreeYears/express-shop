const app = require('../../app');
const request = require('supertest').agent(app.listen());
const should = require("should"); 
const authHelper = require('../middlewares/authHelper');

describe('test/api/user.test.js', () => {
  let token, contactId;
  before((done) => {
    authHelper.createUser()
    .then((user) => {
      mockAdminNickname = user.userName;
      return user;
    })
    .then((user) => {
      authHelper.getToken(request, user.userName)
      .then((result) => {
        token = result;
        done();
      });
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
  });
  after(function (done) {
    done();
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  describe('get /users', () => {
    // 访问 /users，登录用户和非登录用户都会得到相同的结果，所以不需要区别对待
    it('返回一个hello的对象', (done) => {
      request
        .get('/users')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.msg.should.be.exactly('hello');
          done();
        });
    });
  });

  describe('post /users/registered', () => {
    it('不填用户名 注册用户', (done) => {
      request
        .post('/users/registered')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({userPwd: 'test', key: 'nodejs'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('不填密码 注册用户', (done) => {
      request
        .post('/users/registered')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({ userName: `测试---${Date.now()}`, key: 'nodejs'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('不填key 注册用户', (done) => {
      request
        .post('/users/registered')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({ userName: `测试---${Date.now()}`, userPwd: 'test'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('注册用户 成功', (done) => {
      request
        .post('/users/registered')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({ userName: `测试---${Date.now()}`, userPwd: 'test', key: 'nodejs'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
  });

  describe('post /users/login', () => {
    it('登录 不填用户名', (done) => {
      request
        .post('/users/login')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({userPwd: 'test'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('登录 不填密码', (done) => {
      request
        .post('/users/login')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({userName: mockAdminNickname})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('登录 成功', (done) => {
      request
        .post('/users/login')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({userName: mockAdminNickname, userPwd: 'test'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
  });

  describe('get /users/checkLogin', () => {
    it('心跳 成功', (done) => {
      request
        .get('/users/checkLogin')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
  });

  describe('get /users/cartList', () => {
    it('获取购物车列表 成功', (done) => {
      request
        .get('/users/cartList')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
  });

  describe('post /users/add/address', () => {
    it('添加地址 没有收件人', (done) => {
      request
        .post('/users/add/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          contactNumber: '110',
          contactAddress: '友发文称,成都一名游客去西安兵马俑旅游,不小心把手机掉',
          isDefault: 0,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('添加地址 没有电话', (done) => {
      request
        .post('/users/add/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          contactPerson: '隔壁老王',
          contactAddress: '友发文称,成都一名游客去西安兵马俑旅游,不小心把手机掉',
          isDefault: 0,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('添加地址 没有地址', (done) => {
      request
        .post('/users/add/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          contactPerson: '隔壁老王',
          contactNumber: '110',
          isDefault: 0,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('添加地址 没有默认选项', (done) => {
      request
        .post('/users/add/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          contactPerson: '隔壁老王-没有默认',
          contactNumber: '110',
          contactAddress: '友发文称,成都一名游客去西安兵马俑旅游,不小心把手机掉',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
    it('添加地址 成功', (done) => {
      request
        .post('/users/add/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          contactPerson: '隔壁老王',
          contactNumber: '110',
          contactAddress: '友发文称,成都一名游客去西安兵马俑旅游,不小心把手机掉',
          isDefault: 0,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          contactId = res.body.data._id;
          res.body.status.should.be.exactly(0);
          done();
        });
    });
    it('编辑地址 成功', (done) => {
      request
        .post('/users/add/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          contactPerson: '隔壁张三',
          contactNumber: '120',
          contactAddress: '雄曾任连江、台东、苗栗等地检署检察长及“司法院”政风处处长，',
          contactId,
          isDefault: 0,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
  });

  describe('post /users/del/address', () => {
    it('删除地址 没有id', (done) => {
      request
        .post('/users/del/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('删除地址 错误id', (done) => {
      request
        .post('/users/del/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({contactId: '59c4d77b7d2ad3117fb19988'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(1);
          done();
        });
    });
    it('删除地址 成功', (done) => {
      request
        .post('/users/del/address')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({contactId: contactId})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.be.exactly(0);
          done();
        });
    });
  });

});
