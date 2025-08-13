import configPromise from '@payload-config';
import { getPayload } from 'payload';

const validCollections = ['users', 'media', 'tenants', 'events', 'bookings', 'booking-logs', 'notifications'];

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  });

  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const where = searchParams.get('where');

    if (!collection) {
      return Response.json({ error: 'Missing collection parameter' }, { status: 400 });
    }

    if (!validCollections.includes(collection!.toLowerCase())) {
      return Response.json({ error: 'Invalid collection parameter' }, { status: 400 });
    }

    const documents = await payload.find({
      collection: collection as any,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      where: where ? JSON.parse(where) : undefined,
    });

    return Response.json(documents);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  });

  try {
    const body = await request.json();
    const { collection, data } = body;

    if (!collection || !data) {
      return Response.json({ error: 'Missing collection or data' }, { status: 400 });
    }

   if (!validCollections.includes(collection.toLowerCase())) {
     return Response.json({ error: 'Invalid collection parameter' }, { status: 400 });
   }

   const createdDoc = await payload.create({
     collection: collection as any,
     data,
   });

    return Response.json(createdDoc, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  });

  try {
    const body = await request.json();
    const { collection, id, data } = body;

    if (!collection || !id || !data) {
      return Response.json({ error: 'Missing collection, id, or data' }, { status: 400 });
    }
 
    if (!validCollections.includes(collection.toLowerCase())) {
      return Response.json({ error: 'Invalid collection parameter' }, { status: 400 });
    }
 
    const updatedDoc = await payload.update({
      collection: collection as any,
      id,
      data,
    });

    return Response.json(updatedDoc, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  });

  try {
    const body = await request.json();
    const { collection, id } = body;

    if (!collection || !id) {
      return Response.json({ error: 'Missing collection or id' }, { status: 400 });
    }
 
    if (!validCollections.includes(collection.toLowerCase())) {
      return Response.json({ error: 'Invalid collection parameter' }, { status: 400 });
    }
 
    await payload.delete({
      collection: collection as any,
      id,
    });

    return Response.json({ message: 'Document deleted' }, { status: 204 });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};