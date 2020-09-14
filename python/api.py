from flask import Flask
# import request
from flask_cors import CORS
import json
import read

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/bill", methods=["GET"])
def bill():
    # 默认返回内容
    return_dict = read.getData('bill')
    # 判断入参是否为空
    # if request.args is None:
    #     return_dict['return_code'] = '5004'
    #     return_dict['return_info'] = '请求参数为空'
    #     return json.dumps(return_dict, ensure_ascii=False)
    # 获取传入的params参数
    # get_data = request.args.to_dict()
    # name = get_data.get('name')
    # age = get_data.get('age')
    # 对参数进行操作
    # return_dict['result'] = tt(name, age)
    return json.dumps(return_dict)


@app.route("/categories", methods=["GET"])
def categories():
    return_dict = read.getData('categories')
    return json.dumps(return_dict)


# 功能函数
def tt(name, age):
    result_str = "%s今年%s岁" % (name, age)
    return result_str


if __name__ == "__main__":
    app.run(debug=True)
