export const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('');
  }

  const responseData = await response.json();

  return responseData;
};

export const post = async <Req, Res>(url: string, data: Req): Promise<Res> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(`Request failed with status ${responseData.status}`);
  }

  return responseData as Res;
};
