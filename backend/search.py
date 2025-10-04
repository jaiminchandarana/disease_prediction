from connection import connection

def search(rows,term):
    term = str(term).lower()
    filtered = []
    for row in rows:
        if any(term in str(value).lower() for value in row):
            filtered.append(row)
    return filtered

def sort(rows,column,order,column_map):
    col_index = column_map[column]
    reverse = order == 'desc'
    rows = rows.sort(key=lambda x: x[col_index], reverse=reverse)
    return rows