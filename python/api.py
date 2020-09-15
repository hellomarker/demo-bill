import flask
# import request
from flask_cors import CORS
import json
import read
import write

app = flask.Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/bill", methods=["GET"])
def bill():
    return_dict = read.getData('bill')
    return json.dumps(return_dict)


@app.route("/categories", methods=["GET"])
def categories():
    return_dict = read.getData('categories')
    return json.dumps(return_dict)


@app.route("/updateBill", methods=["POST"])
def updateBill():
    print('updateBill', flask.request.values.get('firstName'))
    return_dict = write.writeData([])
    return json.dumps(return_dict)


if __name__ == "__main__":
    app.run(debug=True)
