const convertDate = (date: string): string => {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;

  const match = date.match(dateRegex);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  return date;  
};


export default convertDate