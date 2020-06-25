const request = require('supertest');
const app = require('../app');
const should = require('should')
var db = require('../db.js')


describe('GET /api/post', ()=>{
    describe('성공케이스', ()=>{

        it('게시글이 없는 경우 상태코드 204 응답', (done) =>{
            request(app)
                .get('/api/post')
                .expect(204)
                .end();
        })
        it('게시글이 있는 경우 상태코드 200과 10개 이하의 게시글 반환', (done)=>{
            request(app)
                .get('/api/post')
                .expect(200)
                .end((err,res)=>{
                    res.body.should.have.lengthOf(10);
                    console.log(res.body)
                    done();
                })
        })
    })

})