from http.server import HTTPServer, BaseHTTPRequestHandler
from sentence_transformers import SentenceTransformer, util
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

def score(actions, query):
  # embed query
  query_embedding = model.encode(query)
  # for each action: translate to a sentence, embed this sentence,
  # and record this sentence's semantic similarity to the query
  for action in actions:
    action_str = action["name"].split(":", 1)[1] + " (" + action["practiceID"] + ")"
    #print(action_str)
    action_embedding = model.encode(action["name"])
    similarity = util.cos_sim([action_embedding], [query_embedding])[0].item()
    action["pwimScore"] = similarity
  # return list of actions sorted by embedding closeness to query
  actions.sort(key=lambda action: action["pwimScore"], reverse=True)
  return actions

class PWIMHandler(BaseHTTPRequestHandler):
  def do_OPTIONS(self):
    # allow CORS per https://stackoverflow.com/a/8480578
    self.send_response(200, "ok")       
    self.send_header("Access-Control-Allow-Origin", "*")                
    self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    self.send_header("Access-Control-Allow-Headers", "*")        
    self.end_headers()

  def do_POST(self):
    content_length = int(self.headers.get("Content-Length"))
    body = self.rfile.read(content_length)
    request = json.loads(body)
    print(request)
    actions = score(request["actions"], request["query"])
    self.send_response(200)
    self.send_header("Access-Control-Allow-Origin", "*")
    self.end_headers()
    outjson = json.dumps(actions).encode(encoding="utf_8")
    print(outjson)
    self.wfile.write(outjson)

address = ("localhost", 10000)
httpd = HTTPServer(address, PWIMHandler)
print("PWIM server running on", address)
httpd.serve_forever()
