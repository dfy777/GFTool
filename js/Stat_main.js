var info_update = '2019/12/22'
var num_ref = 2000, num_relia = 10000, num_valid = 200
var lib_cache = new Map
var lib_valid = new Map
var is_alert = false
var data_map = { // [回合，战斗，S胜，判定]
  m124e: [1, 4, true, 5],
  m116: [2, 8, true, 9],
  m115: [1, 5, false, 3],
  m104e4: [2, 4, false, 4],
  m104e5: [2, 5, false, 5],
  m104e6: [2, 6, false, 6],
  m104e7: [2, 7, false, 6],
  m02: [2, 5, true, 5]
}


// function
function num_split(num) {
  var str = num + '', str_new = ''
  var len = str.length, num_sp = Math.ceil(len / 3), num_bios = len - 3 * num_sp
  for (var i = 0; i < len; i++) {
    if (i != 0 && (i - num_bios) - 3 * Math.ceil((i - num_bios) / 3) === 0) str_new += ','
    str_new += str[i]
  }
  return str_new
}
function showAlert() {
  if (is_alert) {
    document.getElementById('info_alert').innerHTML = ''
    document.getElementById('btn_alert').className = 'btn btn-warning'
    document.getElementById('btn_alert').innerHTML = '本页须知'
  } else {
    var str_info = ''
    str_info += '<h5 id="version"></h5>'
    str_info += '<h4>注释</h4>'
    str_info += '<h5><i class="fa fa-check fa-fw"></i><b>值得参考</b> 样本量 <span style="color:dodgerblue"><b>' + num_split(num_ref) + '+</b></span></h5>'
    str_info += '<h5><i class="fa fa-star fa-fw"></i><b>值得信赖</b> 样本量 <span style="color:dodgerblue"><b>' + num_split(num_relia) + '+</b></span></h5>'
    str_info += '<h4>联系</h4>'
    str_info += '<h5><i class="fa fa-qq fa-fw"></i> 693606343 (务必进群<b>私聊</b>) <i class="fa fa-envelope fa-fw"></i> hycdes@qq.com</h5>'
    str_info += '<h4>数据要求</h4>'
    str_info += '<h5><b><span style="color:dodgerblue">核心统计</span></b> (1) 路线 (2) 核心枪类型及数量 (3) Lv10搜救或无搜救 (4) 至少10场</h5>'
    str_info += '<h5><b><span style="color:darkorange">打捞统计</span></b> (1) 地图 (2) Lv10搜救或无搜救 (3) 至少10场 (4) 最好提供所有该活动打捞记录</h5>'
    str_info += '<h5>&nbsp</h5>'
    document.getElementById('info_alert').innerHTML = str_info
    document.getElementById('btn_alert').className = 'btn btn-primary'
    document.getElementById('btn_alert').innerHTML = '隐藏须知'
    document.getElementById('version').innerHTML = '更新时间: ' + info_update
  }
  is_alert = !is_alert
}
function get_card(id, data_entry) {
  var info = ''
  info += '回合 ' + data_entry[0]
  info += ' / ' + data_entry[1] + '战'
  if (data_entry[2]) info += ' <span style="color:darkorange">S胜</span>'
  else info += ' <span style="color:dodgerblue">撤退</span>'
  info += ' / ' + '判定' + data_entry[3]
  document.getElementById(id).innerHTML = info
}
function get_cards(list_id, list_data) {
  var len = list_id.length
  for (var i = 0; i < len; i++) get_card(list_id[i], list_data[i])
}
function fill_table(stat, fairy_status, table, data, num_total) {
  var cores = 0
  var info = '', stat_info = ''
  for (var entry of data) {
    info += '<tr><td>'
    if (entry[0] === 5) {
      info += '<span style="color:darkorange">★★★★★ ' + entry[1] + '</span></td>'
      cores += 5 * entry[2]
    }
    else if (entry[0] === 4) {
      info += '<span style="color:rgb(50, 250, 0)">★★★★ ' + entry[1] + '</span></td>'
      cores += 3 * entry[2]
    } else {
      info += '<span style="color:dodgerblue">★★★ ' + entry[1] + '</span></td>'
      cores += entry[2]
    }
    info += '<td>' + entry[2]
    if (num_total > 0) {
      info += '&nbsp&nbsp&nbsp<span style="color:gray">(' + (100 * entry[2] / num_total).toFixed(2) + '%)</span>'
    }
    info += '</tr></td>'
  }
  if (num_total >= num_relia) stat_info += '<i class="fa fa-star fa-fw"></i>'
  else if (num_total < num_relia && num_total >= num_ref) stat_info += '<i class="fa fa-check fa-fw"></i>'
  stat_info += cores + ' / ' + num_total + ' (<span style="color:dodgerblue">'
  lib_cache.set(stat, (100 * cores / num_total).toFixed(2))
  if (num_total > num_valid) lib_valid.set(stat, true)
  else lib_valid.set(stat, false)
  stat_info += lib_cache.get(stat) + '%</span>)'
  if (fairy_status) stat_info += ' 搜救:<span style="color:red">Lv.10</span>'
  else stat_info += ' 搜救:未开启'
  document.getElementById(stat).innerHTML = stat_info
  document.getElementById(table).innerHTML = info
}
function fill_drag(dragID, stat_data, num_card) {
  for (var n_map = 0; n_map < num_card; n_map++) {
    for (var i = 0; i < 4; i++) {
      var str_info = ''
      if (stat_data[n_map][i][0] > 0) {
        if (stat_data[n_map][i][1] >= num_relia) str_info += '<i class="fa fa-star fa-fw"></i>'
        else if (stat_data[n_map][i][1] < num_relia && stat_data[n_map][i][1] >= num_ref) str_info += '<i class="fa fa-check fa-fw"></i>'
        str_info += stat_data[n_map][i][0] + ' / ' + stat_data[n_map][i][1] + ' (<span style="color:dodgerblue">'
        str_info += (100 * stat_data[n_map][i][0] / stat_data[n_map][i][1]).toFixed(2) + '%</span>)'
      } else str_info = '-'
      var str_ID = dragID + '_' + (n_map + 1) + '_' + (i + 1)
      document.getElementById(str_ID).innerHTML = str_info
    }
  }
}
function fill_drag_normal(dragID, stat_data) {
  var str = '', str_star1 = '', str_star2 = ''
  for (var entry of stat_data) {
    str += '<tr>'
    str += '<td>' + entry[0] + '</td>'
    if (entry[1] === 5) str += '<td style="vertical-align:middle;"><span style="color:darkorange">★★★★★ ' + entry[2] + '</span></td>'
    else if (entry[1] === 4) str += '<td style="vertical-align:middle;"><span style="color:rgb(50, 250, 0)">★★★★ ' + entry[2] + '</span></td>'
    else if (entry[1] === 3) str += '<td style="vertical-align:middle;"><span style="color:dodgerblue">★★★ ' + entry[2] + '</span></td>'
    if (entry[4] >= num_relia) str_star1 += '<i class="fa fa-star fa-fw"></i>'
    else if (entry[4] < num_relia && entry[4] >= num_ref) str_star1 += '<i class="fa fa-check fa-fw"></i>'
    if (entry[6] >= num_relia) str_star2 += '<i class="fa fa-star fa-fw"></i>'
    else if (entry[6] < num_relia && entry[6] >= num_ref) str_star2 += '<i class="fa fa-check fa-fw"></i>'
    if (entry[3] > 0) str += '<td>' + str_star1 + entry[3] + ' / ' + entry[4] + ' (<span style="color:dodgerblue">' + (100 * entry[3] / entry[4]).toFixed(2) + '%</span>)' + '</td>'
    else str += '<td>-</td>'
    if (entry[5] > 0) str += '<td>' + str_star2 + entry[5] + ' / ' + entry[6] + ' (<span style="color:dodgerblue">' + (100 * entry[5] / entry[6]).toFixed(2) + '%</span>)' + '</td>'
    else str += '<td>-</td>'
    str += '</tr>'
    str_star1 = ''
    str_star2 = ''
  }
  document.getElementById(dragID).innerHTML = str
}
function fill_supporter(list_supporter, body_id) {
  var num = list_supporter.length, group = Math.ceil(num / 5), count = 0
  var str = ''
  for (var i = 0; i < group; i++) {
    str += '<tr>'
    for (var j = 0; j < 5; j++) {
      str += '<td class="td_supporter">'
      if (count < num) str += list_supporter[5 * i + j]
      str += '</td>'
      count++
    }
    str += '</tr>'
  }
  document.getElementById(body_id).innerHTML = str
}
function find_in_data(name, list_data) {
  var sum = 0
  for (var data of list_data) {
    for (var entry of data) {
      if (name === entry[1]) {
        sum += entry[2]
        break
      }
    }
  }
  return sum
}
function mergeCell(table1, startRow, endRow, col) {
  var tb = document.getElementById(table1)
  if (!tb || !tb.rows || tb.rows.length <= 0) return
  if (col >= tb.rows[0].cells.length || (startRow >= endRow && endRow != 0)) return
  if (endRow == 0) endRow = tb.rows.length - 1
  for (var i = startRow; i < endRow; i++) {
    tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[col])
    tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan) + 1
  }
}
function deduplicateTable(tableID, data_drag, is_from_thead) {
  var len_data = data_drag.length
  var set_pair = [], temp_pair = []
  var i = 0, j = 1
  var bios = 0
  if (is_from_thead) bios = 1
  while (j < len_data) {
    if (data_drag[i][2] === data_drag[j][2]) {
      temp_pair = [i + bios, j + bios]
      j++
    } else {
      j++
      i = j - 1
      if (temp_pair.length != 0) {
        set_pair.push(temp_pair)
        temp_pair = []
      }
    }
  }
  var len_dedup = set_pair.length
  for (var d = len_dedup - 1; d >= 0; d--) mergeCell(tableID, set_pair[d][0], set_pair[d][1], 1)
}
function sort_bardata(bar_data, bar_name, three_char_command) {
  var sort_style = 1, len = bar_data.length
  var temp_pair, bar_name_new = []
  if (three_char_command === 'asc') sort_style = -1
  for (var i = 0; i < len; i++) {
    for (var j = i + 1; j < len; j++) {
      if (sort_style * (bar_data[i][1] - bar_data[j][1]) < 0) {
        temp_pair = bar_data[i]
        bar_data[i] = bar_data[j]
        bar_data[j] = temp_pair
      }
    }
  }
  for (var i = 0; i < len; i++) bar_name_new.push([i, bar_name[bar_data[i][0]][1]])
  for (var i = 0; i < len; i++) {
    bar_data[i][0] = i
    bar_name[i][0] = i
    bar_name[i][1] = bar_name_new[i][1]
  }
}
function load_stat_bar(bar_data, y_max) {
  var count = 0
  var str_name = ''
  for (var entry of str_current_statname) {
    if (lib_valid.get(entry)) {
      bar_data.push([count, parseFloat(lib_cache.get(entry))])
      if (y_max < parseFloat(lib_cache.get(entry))) y_max = parseFloat(lib_cache.get(entry))
      var temp_str = (entry.split('_'))[1]
      for (var char of temp_str) {
        if (char === 't' || char === 'f') {
          if (char === 't') str_name += ' 搜救'
          break
        }
        str_name += char
      }
      bar_name.push([count, str_name])
      count++
      str_name = ''
    }
  }
  // handle data
  bar_data.push([bar_data.length, 8])
  bar_name.push([bar_name.length, '0-2'])
  count += 1
  // sort
  sort_bardata(bar_data, bar_name, 'dsc')
  return [count, y_max]
}
function loadScript(url) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  document.body.appendChild(script)
}

// data
var data_124etrue = [[5, 'MDR', 2], // 12-4e，搜救
[4, 'TAR-21', 0], [4, 'MAT-49', 2], [4, 'M1918', 1], [4, 'M60', 0], [4, 'PK', 1],
[3, 'Astra Revolver', 1], [3, 'C96', 8], [3, 'M9', 12], [3, 'Makarov', 9],
[3, 'AK-47', 5], [3, 'FNC', 7],
[3, 'MAC-10', 7], [3, 'Micro-UZI', 6], [3, 'Skorpion', 5],
[3, 'M14', 2],
[3, 'M2HB', 6], [3, 'MG42', 7]],
  num_124etrue = 65

var data_124efalse = [[5, 'MDR', 1], // 12-4e，无搜救
[4, 'TAR-21', 1], [4, 'MAT-49', 4], [4, 'M1918', 1], [4, 'M60', 0], [4, 'PK', 0],
[3, 'Astra Revolver', 2], [3, 'C96', 5], [3, 'M9', 11], [3, 'Makarov', 3],
[3, 'AK-47', 1], [3, 'FNC', 5],
[3, 'MAC-10', 1], [3, 'Micro-UZI', 1], [3, 'Skorpion', 6],
[3, 'M14', 2],
[3, 'M2HB', 6], [3, 'MG42', 2]],
  num_124efalse = 86

var data_116true = [[4, 'Colt Revolver', 1], [4, 'AS Val', 1], [4, 'SpringField', 1], [4, 'M1918', 1], [4, 'Mk46', 2], // 11-6，搜救
[3, 'M9', 5], [3, 'P08', 11], [3, 'Type 92', 7], [3, 'Tokarev', 5],
[3, 'OTs-12', 9], [3, 'StG44', 10],
[3, 'MAC-10', 1], [3, 'PPS-43', 3], [3, 'Sten MkII', 6],
[3, 'M1 Garand', 8], [3, 'SV-98', 10],
[3, 'Bren', 10], [3, 'M1919A4', 7]],
  num_116true = 56

var data_116false = [[4, 'Mk46', 2], // 11-6，无搜救
[3, 'M9', 9], [3, 'P08', 3], [3, 'Type 92', 3], [3, 'Tokarev', 7],
[3, 'OTs-12', 8], [3, 'StG44', 2],
[3, 'PPS-43', 2], [3, 'Sten MkII', 4],
[3, 'SV-98', 2], [3, 'M1 Garand', 5],
[3, 'Bren', 4], [3, 'M1919A4', 1]],
  num_116false = 37

var data_104e4true = [ // 10-4e，搜救四战
  [4, 'PP-90', 1],
  [3, 'M9', 3], [3, 'Makarov', 1],
  [3, 'AK-47', 2], [3, 'FNC', 1],
  [3, 'M14', 3],
  [3, 'M2HB', 1], [3, 'MG42', 1]
],
  num_104e4true = 15

var data_104e4false = [ // 10-4e，无搜救四战
  [4, 'Mk23', 2], [4, 'AS Val', 2], [4, 'XM3', 3], [4, 'M60', 1],
  [3, 'Astra Revolver', 4], [3, 'C96', 9], [3, 'M9', 3], [3, 'Makarov', 6],
  [3, 'AK-47', 5], [3, 'FNC', 6],
  [3, 'MAC-10', 4], [3, 'Micro UZI', 3], [3, 'Skorpion', 2],
  [3, 'M14', 2],
  [3, 'M2HB', 4], [3, 'MG42', 4]],
  num_104e4false = 119

var data_104e5true = [[5, 'SR-3MP', 3], // 10-4e，搜救五战
[4, 'Mk23', 5], [4, 'AS Val', 5], [4, 'PP-90', 4], [4, 'XM3', 17], [4, 'M60', 2],
[3, 'Astra Revolver', 25], [3, 'C96', 44], [3, 'M9', 27], [3, 'Makarov', 30],
[3, 'AK-47', 26], [3, 'FNC', 28],
[3, 'MAC-10', 38], [3, 'Micro UZI', 35], [3, 'Skorpion', 28],
[3, 'M14', 31],
[3, 'M2HB', 31], [3, 'MG42', 26]],
  num_104e5true = 422

var data_104e5false = [[5, 'SR-3MP', 1], // 10-4e，无搜救五战
[4, 'Mk23', 2], [4, 'PP-90', 1], [4, 'XM3', 4],
[3, 'Astra Revolver', 8], [3, 'C96', 15], [3, 'M9', 10], [3, 'Makarov', 14],
[3, 'AK-47', 15], [3, 'FNC', 9],
[3, 'MAC-10', 9], [3, 'Micro UZI', 9], [3, 'Skorpion', 10],
[3, 'M14', 7],
[3, 'M2HB', 8], [3, 'MG42', 15]],
  num_104e5false = 210

var data_104e6false = [[5, 'SR-3MP', 34], // 10-4e，无搜救六战
[4, 'Mk23', 39], [4, 'AS Val', 32], [4, 'PP-90', 33], [4, 'XM3', 107], [4, 'M60', 31],
[3, 'Astra Revolver', 306], [3, 'C96', 345], [3, 'M9', 370], [3, 'Makarov', 305],
[3, 'AK-47', 283], [3, 'FNC', 291],
[3, 'MAC-10', 266], [3, 'Micro UZI', 298], [3, 'Skorpion', 297],
[3, 'M14', 299],
[3, 'M2HB', 305], [3, 'MG42', 292]],
  num_104e6false = 4921

var data_104e7true = [[5, 'SR-3MP', 6], // 10-4e，搜救七战
[4, 'Mk23', 8], [4, 'AS Val', 7], [4, 'PP-90', 9], [4, 'XM3', 31], [4, 'M60', 9],
[3, 'Astra Revolver', 58], [3, 'C96', 88], [3, 'M9', 110], [3, 'Makarov', 64],
[3, 'AK-47', 72], [3, 'FNC', 76],
[3, 'MAC-10', 65], [3, 'Micro UZI', 79], [3, 'Skorpion', 84],
[3, 'M14', 73],
[3, 'M2HB', 81], [3, 'MG42', 74]],
  num_104e7true = 938

var data_104e7false = [[5, 'SR-3MP', 1], // 10-4e，无搜救七战
[3, 'C96', 2], [3, 'Makarov', 2],
[3, 'AK-47', 2], [3, 'FNC', 2],
[3, 'MAC-10', 4], [3, 'Micro UZI', 2],
[3, 'M2HB', 4], [3, 'MG42', 1]],
  num_104e7false = 26

var data_115true = [ // 11-5，搜救
  [3, 'Astra Revolver', 1], [3, 'Makarov', 1],
  [3, 'MAC-10', 1], [3, 'Skorpion', 1],
  [3, 'M2HB', 1]]

var data_115false = [[4, 'P7', 10], [4, '9A-91', 2], [4, 'PP-90', 1], [4, 'PK', 2],// 11-5，无搜救
[3, 'Astra Revolver', 64], [3, 'C96', 74], [3, 'M9', 73], [3, 'Makarov', 83],
[3, 'AK-47', 73], [3, 'FNC', 72],
[3, 'MAC-10', 62], [3, 'Micro UZI', 63], [3, 'Skorpion', 62],
[3, 'M14', 73],
[3, 'M2HB', 68], [3, 'MG42', 69]],
  num_115false = 2290

var data_drag1 = [ // 5月4日打捞
  [[1, 60], [5, 450], [1, 140], [21, 1939]],
  [[0, 0], [3, 109], [3, 252], [17, 1626]],
  [[1, 14], [11, 1354], [3, 392], [28, 2769]],
  [[0, 0], [3, 291], [5, 475], [21, 2514]],
  [[4, 220], [24, 3884], [0, 0], [3, 567]],
  [[2, 241], [14, 1946], [3, 386], [19, 3292]]
]
var data_dragva11 = [ // 酒保联动打捞
  [[2, 249], [7, 893], [0, 0], [1, 189]],
  [[0, 0], [7, 1135], [0, 0], [0, 0]],
  [[13, 2208], [22, 4477], [10, 1358], [2, 344]],
  [[3, 379], [18, 2876], [0, 0], [0, 0]],
  [[15, 2766], [51, 13418], [2, 453], [2, 78]],
  [[10, 1395], [22, 4366], [4, 570], [2, 123]]
]
var data_dragsc = [ // shattered connexion
  [[1, 182], [0, 0], [1, 258], [0, 0]], // Cx4 Storm 1-5
  [[0, 0], [0, 0], [0, 0], [0, 0]], // Cx4 Storm 3-2
  [[1, 182], [0, 0], [1, 258], [0, 0]], // A-91 1-5
  [[0, 0], [0, 0], [0, 0], [0, 0]], // A-91 3-2
  [[0, 0], [4, 516], [2, 360], [4, 559]], // SSG3000 2-1
  [[0, 0], [0, 0], [2, 250], [0, 0]], // SSG3000 3-1
  [[0, 0], [5, 615], [1, 71], [3, 266]], // M870 2-1
  [[0, 0], [0, 0], [1, 33], [0, 0]], // M870 3-6
  [[0, 0], [2, 335], [1, 23], [0, 0]], // AK-74U 2-2
  [[0, 0], [0, 0], [0, 0], [0, 0]], // AK-74U 3-6
  [[0, 0], [1, 264], [1, 149], [2, 186]], // M82A1 2-1
  [[0, 0], [0, 0], [0, 0], [0, 0]], // M82A1 4-2
  [[0, 0], [1, 186], [0, 0], [1, 180]], // R93 2-3
  [[0, 0], [0, 0], [0, 0], [0, 0]], // R93 4-3
  [[0, 0], [1, 150], [1, 48], [2, 340]], // JS 9 2-3
  [[0, 0], [0, 0], [0, 0], [0, 0]], // JS 9 4-4
  [[0, 0], [3, 471], [6, 777], [3, 650]], // Kord 2-4
  [[0, 0], [0, 0], [0, 0], [0, 0]] // Kord 4-5
]

var list_supporter_1 = [
  '命运の乐章', '夏季末至', 'AsLegend', 'Mapleaf', 'falcon',
  '老徐', '榭榆', 'MIЯЯOЯ', '欣欢症', '君漓莒',
  'cookiesiclink', 'Airnors', 'Scottdoha', 'AT4', '白金世界'
],
  list_supporter_2 = [
    '哒酱', '门对千竿竹', '莉莉丝爱你哦', 'Flonne', 'mrduck',
    '小林', '永遠のマカク焼酎', '阿斯托尔福', '碧蓝如海的天际', '菠萝小蜜橙',
    '田村吼姆拉', '无言寂心', 'Miyasizu', '钢板天下第一', '岭南弄潮儿',
    'Scottdoha', 'Mapleaf', '初雪', 'ViveLaFrance', '净化者先锋突击队',
    'ZeroR', '无限拥抱', 'E同学提不起劲', 'Remの微笑', '绮夜',
    '煭洛凝瀧', '铭1989', 'Ayaya', '这年代黑暗', 'FangZero',
    '龙游浅滩', '山小珊', '1', '不愿意匿名的45老公', 'KsZ_本居小铃',
    'Amuletloli', '无问西东', '吉野晴彦', '凤凰', 'marciy',
    '世间可有两全法', '挽筝', '北梦', '孜然', '全家福',
    '雨上がり', '一罐皮卡丘', 'KON花火', '一名路过的群众', '茂茂',
    '命运の乐章', '没法玩了', '飘帆', '界儿', 'Airnors', 'Gaberae',
    'GoTheK', 'WHJ', '我永远喜欢芙兰', 'Glimmer', '你可真是个小机灵鬼',
    'M4A1', '嗷，是黎妄哒', '极暗君', '开心枪场', '风柒',
    'ミライアカリ', '一只老咸鱼', 'timewalker', '十一婵娟', '猹',
    'Spike', '94礼服味煤气', '丧心病狂WB', '我很可爱请打钱', '咖啡幻想',
    '玄煞', '蓝光剑士', '时时时茶', '停云', '忘记过去',
    'WASHERxxxx', '笑了岂乐', '烈阳余晖', '霜流', 'Mo',
    '3SVS3', '喵', 'YingYingYing', '丶桜洛', '没发玩了',
    '一的零次方', '北原和纱', 'shyacz', 'Eric F', 'UMP40',
    '卡尔', '858512656', 'Misaka19009', '趴窝少女wa酱', 'Angevil',
    '白首如新', '铃奈庵看板娘'
  ]

var data_drag_normal = [
  ['1-4E', 3, 'Glock 17 <span style="color:black">[Ch.1 only]</span>', 0, 0, 3, 151],
  ['2-4E', 3, 'FMG-9 <span style="color:black">[Ch.2 only]</span>', 0, 0, 2, 117],
  ['3-4E', 3, 'CZ-805 <span style="color:black">[Ch.3 only]</span>', 0, 0, 2, 247],
  ['4-4E', 3, 'M21 <span style="color:black">[Ch.4 only]</span>', 0, 0, 5, 277],
  ['5-6', 3, 'M249 SAW <span style="color:black">[Ch.5 only]</span>', 0, 0, 4, 322],
  ['6-4E', 3, 'M1A1 <span style="color:black">[Ch.6 only]</span>', 1, 60, 2, 165],
  ['7-6', 3, 'PSM <span style="color:black">[Ch.7 only]</span>', 1, 87, 0, 0],
  ['9-6', 4, 'Ak 5 <span style="color:black">[Ch.9 only]</span>', 0, 0, 1, 176],
  ['10-4E', 4, 'XM3 <span style="color:black">[Ch.10 only]</span>',
    find_in_data('XM3', [data_104e7true, data_104e5true, data_104e4true]),
    2 * (num_104e7true + num_104e5true + num_104e4true),
    find_in_data('XM3', [data_104e7false, data_104e6false, data_104e5false, data_104e4false]),
    2 * (num_104e7false + num_104e6false + num_104e5false + num_104e4false)],
  ['11-6', 4, 'Mk46 <span style="color:black">[Ch.11 only]</span>',
    find_in_data('Mk46', [data_116true]),
    3 * num_116true,
    find_in_data('Mk46', [data_116false]),
    3 * num_116false],
  ['11-4E', 4, 'Mk46 <span style="color:black">[Ch.11 only]</span>', 0, 0, 2, 288],
  ['11-6', 4, 'MAT-49 <span style="color:black">[Ch.12 only]</span>', 0, 0, 0, 0],
  ['12-4E', 4, 'MAT-49 <span style="color:black">[Ch.12 only]</span>',
    find_in_data('MAT-49', [data_124etrue]),
    3 * num_124etrue,
    find_in_data('MAT-49', [data_124efalse]),
    3 * num_124efalse
  ],
  ['0-2', 4, 'PK', 0, 0, 5, 3228],
  ['6-4E', 5, 'Vector', 0, 0, 1, 165],
  ['10-4E', 5, 'SR-3MP',
    find_in_data('SR-3MP', [data_104e7true, data_104e5true, data_104e4true]),
    2 * (num_104e7true + num_104e5true + num_104e4true),
    find_in_data('SR-3MP', [data_104e7false, data_104e6false, data_104e5false, data_104e4false]),
    2 * (num_104e7false + num_104e6false + num_104e5false + num_104e4false)],
  ['11-4E', 5, 'M99', 0, 0, 1, 288]
]
var data_drag_resident = [
  ['塌缩点-再点火4', 5, 'MP7', 2, 284, 0, 0],
  ['塌缩点-冲程止点2', 4, 'Thunder', 0, 0, 1, 225],
  ['塌缩点-弱子死局4', 5, 'EOT XPS3(HK416)', 0, 0, 1, 340]
]
var str_current_statname = [
  'stat_124etrue', 'stat_124efalse',
  'stat_116true', 'stat_116false', 'stat_115true', 'stat_115false',
  'stat_104e7true', 'stat_104e5true', 'stat_104e4true',
  'stat_104e7false', 'stat_104e6false', 'stat_104e5false', 'stat_104e4false']
var bar_info = [], bar_data = [], bar_name = [], bar_num = 0, y_max = 0

var list_card = [
  'card_124e', 'card_124e_2',
  'card_116', 'card_116_2', 'card_115', 'card_115_2',
  'card_104e7', 'card_104e7_2', 'card_104e6_2', 'card_104e5', 'card_104e5_2', 'card_104e4', 'card_104e4_2',
  'card_02']
var list_data_card = [
  data_map.m124e, data_map.m124e,
  data_map.m116, data_map.m116, data_map.m115, data_map.m115,
  data_map.m104e7, data_map.m104e7, data_map.m104e6, data_map.m104e5, data_map.m104e5, data_map.m104e4, data_map.m104e4,
  data_map.m02]

window.onload = function () {
  // drag
  mergeCell('table_drag1', 10, 11, 0)
  mergeCell('table_drag1', 8, 9, 0)
  mergeCell('table_drag1', 6, 7, 0)
  mergeCell('table_drag1', 4, 5, 0)
  mergeCell('table_drag1', 2, 3, 0)
  mergeCell('table_drag1', 0, 1, 0)
  fill_drag('drag1', data_drag1, 6)
  // mergeCell()
  // shattered connexion
  mergeCell('table_dragsc', 32, 35, 0)
  mergeCell('table_dragsc', 28, 31, 0)
  mergeCell('table_dragsc', 24, 27, 0)
  mergeCell('table_dragsc', 20, 23, 0)
  mergeCell('table_dragsc', 16, 19, 0)
  mergeCell('table_dragsc', 12, 15, 0)
  mergeCell('table_dragsc', 8, 11, 0)
  mergeCell('table_dragsc', 4, 7, 0)
  mergeCell('table_dragsc', 0, 3, 0)
  fill_drag('dragsc', data_dragsc, 18)
  // vall-halla
  mergeCell('table_dragva11', 10, 11, 0)
  mergeCell('table_dragva11', 8, 9, 0)
  mergeCell('table_dragva11', 6, 7, 0)
  mergeCell('table_dragva11', 4, 5, 0)
  mergeCell('table_dragva11', 2, 3, 0)
  mergeCell('table_dragva11', 0, 1, 0)
  fill_drag('dragva11', data_dragva11, 6)
  fill_drag_normal('table_drag_normal', data_drag_normal)
  fill_drag_normal('table_drag_resident', data_drag_resident)
  // main-story deduplicate
  deduplicateTable('table_drag_normal', data_drag_normal, false)
  // cores
  get_cards(list_card, list_data_card)
  fill_table('stat_124etrue', true, 'table_124etrue', data_124etrue, 4 * num_124etrue)
  fill_table('stat_124efalse', true, 'table_124efalse', data_124efalse, 4 * num_124efalse)
  fill_table('stat_116true', true, 'table_116true', data_116true, 8 * num_116true)
  fill_table('stat_116false', false, 'table_116false', data_116false, 8 * num_116false)
  fill_table('stat_115true', true, 'table_115true', data_115true, 50)
  fill_table('stat_115false', false, 'table_115false', data_115false, 5 * num_115false)
  fill_table('stat_104e7true', true, 'table_104e7true', data_104e7true, 7 * num_104e7true)
  fill_table('stat_104e7false', false, 'table_104e7false', data_104e7false, 7 * num_104e7false)
  fill_table('stat_104e6false', false, 'table_104e6false', data_104e6false, 6 * num_104e6false)
  fill_table('stat_104e5true', true, 'table_104e5true', data_104e5true, 5 * num_104e5true) // 五战搜救
  fill_table('stat_104e5false', false, 'table_104e5false', data_104e5false, 5 * num_104e5false)
  fill_table('stat_104e4true', true, 'table_104e4true', data_104e4true, 4 * num_104e4true)
  fill_table('stat_104e4false', false, 'table_104e4false', data_104e4false, 4 * num_104e4false)
  // supporters
  fill_supporter(list_supporter_1, 'spt_1')
  fill_supporter(list_supporter_2, 'spt_2')
  document.getElementById('text_validnum').innerHTML = num_valid
  // make graph
  var result_pair = load_stat_bar(bar_data, y_max)
  bar_num = result_pair[0], y_max = result_pair[1]
  bar_info.push({
    data: bar_data,
    bars: {
      barWidth: 0.5,
      align: 'center',
      horizontal: false
    }
  })
  $.plot($('#placeholder'), bar_info,
    {
      series: {
        bars: {
          show: true
        }
      },
      xaxis: {
        min: -1,
        max: bar_num,
        tickDecimals: 0,
        font: {
          lineHeight: 13,
          color: '#000000'
        },
        shadowSize: 0,
        ticks: bar_name
      },
      yaxis: {
        min: 0,
        max: y_max * 1.1,
        tickDecimals: 0,
        font: {
          lineHeight: 13,
          color: '#000000'
        },
        shadowSize: 0
      },
      grid: {
        hoverable: true
      },
      tooltip: true,
      tooltipOpts: {
        content: '核心产率: %y%'
      }
    })
}
