/*

skip: Es el número de registros que se omiten antes de empezar a tomar registros. 
        Si tienes 20 registros y pones skip = 3, se omitirán los primeros 3 
        registros y empezarás a tomar registros desde el cuarto en adelante.
take: Es el número de registros que se tomarán después de omitir los primeros 
        registros utilizando skip. Si pones take = 2, se tomarán 2 
        registros después de los primeros 3 que se omitieron, 
        devolviendo así un total de 2 registros en la página actual.

Osea que para la primera consulta skip debe ser 0 y para que me devuelva de 5 take debe ser igual a 5
*/

import { Pagination } from "@/types";

export default function UsePagination(
  baseUrl: `/${string}`,
  query: {
    skip?: string | string[];
    take?: string | string[];
    page?: string | string[];
  }
): Pagination {
  let skip = 0;
  let take = 10;
  let page = 1;
  if (Object.keys(query).every((q) => ["skip", "take", "page"].includes(q))) {
    if (query.page !== undefined && !Array.isArray(query.page)) {
      page = parseInt(query.page);
    }
    if (
      query.skip !== undefined &&
      query.take !== undefined &&
      !Array.isArray(query.skip) &&
      !Array.isArray(query.take)
    ) {
      skip = parseInt(query.skip);
      take = parseInt(query.take);
    }
  }
  const pagination = {
    skip,
    nextSkip: page * take + skip,
    take,
    page,
  };
  return {
    skip,
    take,
    url: {
      currentPage: `${baseUrl}?page=${pagination.page}&skip=${pagination.skip}&take=${pagination.take}`,
      nextPage: `${baseUrl}?page=${pagination.page + 1}&skip=${
        pagination.nextSkip
      }&take=${pagination.take}`,
    },
  };
}
