import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {
  isAdmin,
  isSuperAdmin,
  verifyToken
} from '../../middlewares/auth.middleware';
import { getUserData, Response, createUser, getUser } from '../utils/db.utils';
import models from '../../db/models';
const { User } = models;

dotenv.config();

const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Authentication middleware', () => {
  it('Should return an error if token is not provided', async () => {
    const req = {
      headers: 'x-access-token'
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    await verifyToken(req, res, next);
    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledWith({
      status: 401,
      error: 'not authorized'
    });
  });

  it('Should return an error if there is a deep error ', async () => {
    const token = jwt.sign(
      {
        id: 23,
        email: 'sample@getMaxListeners.com'
      },
      process.env.SECRET
    );

    const req = {
      headers: {
        'x-access-token': token
      }
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    await verifyToken(req, res, next);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({
      status: 400,
      error: 'token has expired'
    });
  });

  it('Should return an error if user does not exist ', async () => {
    const user = getUser();
    await createUser(user);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.roleType
      },
      process.env.SECRET,
      {
        expiresIn: '12h'
      }
    );

    const req = {
      headers: {
        'x-access-token': token
      }
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    await verifyToken(req, res, next);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({
      error: 'invalid token provided',
      status: 400
    });
  });

  it('Should return an error if user is not an admin ',  () => {
    const req = {
      user: {
        role: null
      }
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    isAdmin(req, res, next);
    expect(res.status).to.have.been.calledWith(403);
    expect(res.json).to.have.been.calledWith({ message: 'Unauthorized' });
  });

  it('Should return an error if user is not super admin ',  () => {
    const req = {
      user: {
        role: null
      }
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    isSuperAdmin(req, res, next);
    expect(res.status).to.have.been.calledWith(403);
    expect(res.json).to.have.been.calledWith({ message: 'Unauthorized' });
  });

});

