import json
from urllib import request, parse
import random


# ======================================================================
# This function sends a prompt workflow to the specified URL
# (http://127.0.0.1:8188/prompt) and queues it on the ComfyUI server
# running at that address.
def queue_prompt(prompt_workflow):
    p = {"prompt": prompt_workflow}
    data = json.dumps(p).encode('utf-8')
    req = request.Request("http://127.0.0.1:8188/prompt", data=data)
    request.urlopen(req)


def read_props_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        return data


def read_prompts_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        return data['prompts']


# ======================================================================

# read workflow api data from file and convert it into dictionary
# assign to var prompt_workflow
prompt_workflow = json.load(open('simple_workflow_api.json'))

# give some easy-to-remember names to the nodes
chkpoint_loader_node = prompt_workflow["1"]
prompt_pos_node = prompt_workflow["4"]
prompt_neg_node = prompt_workflow["5"]
empty_latent_img_node = prompt_workflow["3"]
ksampler_node = prompt_workflow["2"]
save_image_node = prompt_workflow["7"]

# load the props from the front end
props = json.load(open('props.json'))

ckptpath = ""

if props.get('version') == "SDXL"
    cpktpath = "SD.XL/" + props.get('cpkt')
elif props.get('version') == "SD15"
    ckptpath = "SD1.5"

chkpoint_loader_node["inputs"]["ckpt_name"] = props.get('ckpt')
# load the checkpoint that we want.
# if props.get('sdxl'):  # This checks if props['sdxl'] is True
#     chkpoint_loader_node["inputs"]["ckpt_name"] = "dynavision_0557.safetensors"
# else:
#     chkpoint_loader_node["inputs"]["ckpt_name"] = "rc_realistic_v7.safetensors"

# set image dimensions and batch size in EmptyLatentImage node
empty_latent_img_node["inputs"]["width"] = props.get('width')
empty_latent_img_node["inputs"]["height"] = props.get('height')

# each prompt will produce a batch of 1 image
empty_latent_img_node["inputs"]["batch_size"] = 1

# for every prompt in prompt_list...
# for index, prompt in enumerate(prompt_list):

# set the text prompt for positive CLIPTextEncode node
prompt_pos_node["inputs"]["text"] = props.get('pos_prompt')
prompt_neg_node["inputs"]["text"] = props.get('neg_prompt')

# set a random seed in KSampler node
ksampler_node["inputs"]["seed"] = random.randint(1, 18446744073709551614)

# set the number of steps from the user input
ksampler_node["inputs"]["steps"] = props.get('steps')

# set the cfg from the user input
ksampler_node["inputs"]["cfg"] = props.get('cfg')

# set the sampler from the user input
ksampler_node["inputs"]["sampler_name"] = props.get('sampler')

# set the scheduler from the user input
ksampler_node["inputs"]["scheduler"] = props.get('scheduler')

#     # if it is the last prompt
#     if index == 3:
#         # set latent image height to 768
#         empty_latent_img_node["inputs"]["height"] = 1024

# set filename prefix to be the same as prompt
# (truncate to first 100 chars if necessary)
fileprefix = props.get('pos_prompt')
# fileprefix = 'chakreact'
if len(fileprefix) > 100:
    fileprefix = fileprefix[:100]

save_image_node["inputs"]["filename_prefix"] = props.get('prefix')

# everything set, add entire workflow to queue.
queue_prompt(prompt_workflow)

print(f"FILENAME: {props.get('prefix')}")

