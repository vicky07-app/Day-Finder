def day_finder(date,month,year):
    month = month.lower()
    hsmp = {
    "january":13 ,
    "february":14,
    "march":3,
    "april":4,
    "may":5,
    "june":6,
    "july":7,
    "august":8,
    "september":9,
    "october":10,
    "november":11,
    "december":12,
}
    days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"]
    
    if month in hsmp:
        m = hsmp[month]
    else:
        return month
    
    if m in {13,14}:
        year -= 1
        
    q = date
    j = year // 100 # first two digits in year
    k = year % 100 # last two digit (remainder)

    h = ( q + (13*(m+1))//5 + k + k//4 + j//4 + 5*j ) % 7
    return days[h]
