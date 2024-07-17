import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core services/prisma/prisma.service';
import { PostDto } from 'src/services/post/post.dto';
import { EditUserDto, Gender } from '../src/services/user/user.dto';
import { AuthDto } from 'src/services/auth/auth.dto';
import { MinioService } from '../src/core services/minio/minio.service';

describe('App e2e testing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let minio: MinioService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(5003);
    prisma = app.get(PrismaService);
    minio = app.get(MinioService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:5003/api');
  });

  afterAll(() => {
    app.close();
  });

  const dto: AuthDto = {
    email: 'anoop@gmail.com',
    name: 'Anoop Singh',
    password: 'welcome',
  };

  const userUpdate: EditUserDto = {
    name: 'Anoop Singh',
    bio: 'I am a MERN stack developer',
    gender: Gender.Male,
  };

  describe('auth', () => {
    describe('signup', () => {
      it('should throw error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ name: dto.name })
          .expectStatus(400)
          .inspect();
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });

      it('should throw error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(409)
          .inspect();
      });
    });

    describe('signin', () => {
      it('should singin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'token');
      });
    });
  });

  /*  describe('user', () => {
    it('should get all users', () => {
      return pactum.spec().get('/users').expectStatus(401);
    });

    it('should get all users', () => {
      return pactum
        .spec()
        .get('/users')
        .expectStatus(200)
        .withHeaders({ Authorization: 'Bearer $S{token}' });
    });

    it('it should update user name ', () => {
      return pactum
        .spec()
        .post('/users')
        .expectStatus(201)
        .withBody({ name: userUpdate.name })
        .withHeaders({ Authorization: 'Bearer $S{token}' });
    });

    it('it should update user bio ', () => {
      return pactum
        .spec()
        .post('/users')
        .expectStatus(201)
        .withBody({ name: userUpdate.bio })
        .withHeaders({ Authorization: 'Bearer $S{token}' });
    });

    it('it should update user gender ', () => {
      return pactum
        .spec()
        .post('/users')
        .expectStatus(201)
        .withBody({ name: userUpdate.gender })
        .withHeaders({ Authorization: 'Bearer $S{token}' });
    });

    it('it should update user name, bio and gender ', () => {
      return pactum
        .spec()
        .post('/users')
        .expectStatus(201)
        .withBody(userUpdate)
        .withHeaders({ Authorization: 'Bearer $S{token}' });
    });
  });
 */
  /* describe('post', () => {
    const post: PostDto = {
      content: 'this is a test post',
      image: 'image-url.jpg',
    };

    it('should create a post if both image and content provided', () => {
      return pactum
        .spec()
        .post('/posts')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .withBody({
          content: 'This is a test post',
          image: 'image-url.jpg',
        })
        .expectStatus(201)
        .stores('postId', 'id');
    });

    it('should create a post if only content provided', () => {
      return pactum
        .spec()
        .post('/posts')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .withBody({
          content: 'This is a test post',
        })
        .expectStatus(201);
    });

    it('should create a post if only image provided', () => {
      return pactum
        .spec()
        .post('/posts')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .withBody({
          image: 'image-url.jpg',
        })
        .expectStatus(201);
    });

    it('should get all posts', () => {
      return pactum
        .spec()
        .get('/posts')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .expectStatus(200);
    });

    it('should throw erorr to get all posts with not authenticated', () => {
      return pactum.spec().get('/posts').expectStatus(401);
    });

    it('should get a single post', () => {
      return pactum
        .spec()
        .get('/posts/$S{postId}')
        .withPathParams('id', '$S{postId}')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .expectStatus(200)
        .expectBodyContains('This is a test post');
    });

    it('should throw erorr to get single posts with not authenticated', () => {
      return pactum
        .spec()
        .get('/posts/$S{postId}')
        .withPathParams('id', '$S{postId}')
        .expectStatus(401);
    });

    it('should update a post', () => {
      return pactum
        .spec()
        .patch('/posts/$S{postId}')
        .withPathParams('id', '$S{postId}')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .withBody({
          content: 'Updated post content',
        })
        .expectStatus(200)
        .expectBodyContains('Updated post content');
    });

    it('should throw error if not authenticated (post update)', () => {
      return pactum
        .spec()
        .patch('/posts/$S{postId}')
        .withPathParams('id', '$S{postId}')
        .withBody({
          content: 'Updated post content',
        })
        .expectStatus(401);
    });

    it('should delete a post', () => {
      return pactum
        .spec()
        .delete('/posts/$S{postId}')
        .withPathParams('id', '$S{postId}')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .expectStatus(204);
    });

    it('should throw error if invalid postId provided (post delete)', () => {
      return pactum
        .spec()
        .delete('/posts/393993')
        .withPathParams('id', '393993')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .expectStatus(404);
    });

    it('should not find the deleted post', () => {
      return pactum
        .spec()
        .get('/posts/{id}')
        .withHeaders({ Authorization: 'Bearer $S{token}' })
        .withPathParams('id', '$S{postId}')
        .expectStatus(404);
    });
  }); */

  beforeAll(async () => {
    const post: PostDto = {
      content: 'this is a test post',
      image: 'image-url.jpg',
    };
    await pactum
      .spec()
      .post('/posts')
      .withHeaders({ Authorization: 'Bearer $S{token}' })
      .withBody(post)
      .stores('postId', 'id')
      .expectStatus(201);
  });

  describe('like', () => {
    it('should like a post', async () => {
      await pactum
        .spec()
        .post('/likes')
        .withHeaders({ Authorization: `Bearer $S{token}` })
        .expectStatus(HttpStatus.CREATED)
        .withBody({ postId: '$S{postId}' })
        .stores('id', 'likeId')
        .end();
    });

    it('should not like a non-existing post', async () => {
      await pactum
        .spec()
        .post('/likes')
        .withHeaders({ Authorization: `Bearer $S{token}` })
        .withBody({ postId: '$S{postId}' })
        .expectStatus(HttpStatus.BAD_REQUEST)
        .end();
    });

    it('should unlike a post', async () => {
      await pactum
        .spec()
        .delete('/likes/$S{likeId}')
        .withHeaders({ Authorization: `Bearer $S{token}` })
        .expectStatus(HttpStatus.OK)
        .end();
    });

    it('should not unlike a non-existing like', async () => {
      await pactum
        .spec()
        .delete('/likes/999')
        .withHeaders({ Authorization: `Bearer $S{token}` })
        .withBody({ postId: '999' })
        .expectStatus(HttpStatus.BAD_REQUEST)
        .end();
    });
  });
});
