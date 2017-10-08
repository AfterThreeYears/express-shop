const app = require('../../app');
const request = require('supertest').agent(app.listen());
const should = require("should"); 
const authHelper = require('../middlewares/authHelper');
const Mock = require('../../models/mocks');

describe('test/api/index.test.js', () => {
  let token, mockId;
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

  describe('get /api/list', () => {
    it('获取mock列表', (done) => {
      request
        .get('/api/list')
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.true();
          done();
        });
    });
  });

  describe('post /api/saveOrupdate', () => {
    it('更新接口 错误的id', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`, jsonStr: '["name": "wbb"]', id: 1})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    it('更新接口 没有id', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`, jsonStr: '["name": "wbb"]'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    it('更新接口 没有path', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({jsonStr: '["name": "wbb"]', id: 1})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    it('新增接口 没有path', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({jsonStr: '["name": "wbb"]'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    it('更新接口 没有jsonStr', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`, id: 1})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    it('新增接口 没有jsonStr', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    it('新增接口 成功', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`, jsonStr: '[]'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          mockId = res.body.data;
          res.body.success.should.be.true();
          done();
        });
    });
    it('更新接口 成功', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`, jsonStr: "[]", id: mockId})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.true();
          done();
        });
    });
  });

  describe('get /api/detail', () => {
    it('获取接口详情 没有id', (done) => {
      request
        .get(`/api/detail`)
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.false();
          done();
        });
    });
    // it('获取接口详情 错误id', (done) => {
    //   request
    //     .get('/api/detail?id=1111')
    //     .set('Authorization', `Bearer ${token}`)
    //     .set('cookie', `access_token=${token}`)
    //     .expect(200)
    //     .end((err, res) => {
    //       if (err) return done(err);
    //       res.body.success.should.be.false();
    //       done();
    //     });
    // });
    it('新增接口 成功', (done) => {
      request
        .post('/api/saveOrupdate')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .send({path: `/test/${Date.now()}`, jsonStr: '[]'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          mockId = res.body.data;
          res.body.success.should.be.true();
          done();
        });
    });
    it('获取接口详情 成功', (done) => {
      request
        .get(`/api/detail?id=${mockId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('cookie', `access_token=${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.success.should.be.true();
          done();
        });
    });
  });
});