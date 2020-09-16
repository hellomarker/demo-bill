import flask
# import request
from flask_cors import CORS
import json
import read
import write

app = flask.Flask(__name__)
CORS(app, supports_credentials=True)

# success = {'code': '200', 'msg': '处理成功', 'result': False}
fail = {
    'code': '400',
    'msg': '处理失败',
}


@app.route("/bill", methods=["GET"])
def bill():
    return_dict = read.getData('bill')
    return json.dumps(return_dict)


@app.route("/categories", methods=["GET"])
def categories():
    return_dict = read.getData('categories')
    return json.dumps(return_dict)


@app.route("/addBill", methods=["POST"])
def addBill():
    if flask.request.get_data() is None:
        return json.dumps(fail)
    return_dict = read.getData('bill')
    return_dict.append(
        json.loads(str(flask.request.get_data(), encoding='utf-8')))
    return_dict = write.writeData(return_dict, 'bill')
    return json.dumps({})


if __name__ == "__main__":
    app.run(debug=True)
