from __future__ import print_function
import pickle
import numpy as np
import argparse
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torchvision
from torchvision import datasets, transforms
from torch.autograd import Variable
import random
import scipy.ndimage

#ConvNet Model
class ConvNet(nn.Module):
    def __init__(self, layers):
        super(ConvNet, self).__init__()
        self.layer_modules, self.batch_norms, self.act_modules = self.parse_layers(layers)

        # add modules to convnet object
        for i in range(len(self.layer_modules)):
            self.add_module("layer"+str(i), self.layer_modules[i])
            if self.batch_norms[i] is not None:
                self.add_module("bn"+str(i), self.batch_norms[i])

        self.fc1 = nn.Linear(self.flat_count, 100)
        self.fc1bn = nn.BatchNorm1d(100, eps=1e-05, momentum=0.1, affine=True)
        self.fc2 = nn.Linear(100, 10)
        self.fc2bn = nn.BatchNorm1d(10, eps=1e-05, momentum=0.1, affine=True)

        self.init_weights()

    def forward(self, x):
        # keep track of "lateral" outputs for ladder network
        laterals = []
        # Loop through all convlutional/pooling layers
        for m in range(len(self.layer_modules)):
            # convolutional or pooling layer
            x = self.layer_modules[m](x)
            # batch normalization
            if self.batch_norms[m] is not None:
                x = self.batch_norms[m](x)
            laterals.append(x)
            # activation
            if self.act_modules[m] is not None:
                x = self.act_modules[m](x)
        # Flatten for fully connect layers
        x = x.view(-1, self.flat_count)
        x = self.fc1(x)
        x = self.fc1bn(x)
        #laterals.append(x)
        x = F.relu(x)
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        x = self.fc2bn(x)
        #laterals.append(x)
        return x

    def init_weights(self):
        # initializes all weights to uniform distribution between -0.1 and 0.1
        # all biases initialized to 0
        init_range = 0.1
        for mod in self.layer_modules:
            try:
                mod.weight.data.uniform_(-init_range, init_range)
                mod.bias.data.fill_(0)
            except:
                pass
        self.fc1.weight.data.uniform_(-init_range, init_range)
        self.fc2.weight.data.uniform_(-init_range, init_range)
        self.fc1.bias.data.fill_(0)
        self.fc2.bias.data.fill_(0)

    def parse_layers(self, layers):
        # Takes layers argument and creates corresponding model
        # layer types: convf (padding), convv (no padding), maxpool
        # arguments: layer-type, filters, kernel, batch-normalization bool, activation

        # e.g. layers = [["convf", 32, 5, True, "lrelu"], ["maxpool", 0, 2, True, "lrelu"],
        #         ["convf", 64, 3, True, "lrelu"], ["convf", 64, 3, True, "lrelu"],
        #         ["maxpool", 0, 2, False, ""], ["convf", 128, 3, True, "lrelu"]]

        self.layers = layers
        channels = [1]
        layer_modules = {}
        act_modules = {}
        bn_modules = {}
        input_dim = [28]
        filter_count = []

        for l, layer in enumerate(layers):
            layer_type, filters, kernel, bn, act = layer

            # Find layer type and create convolutional / pooling objects
            if layer_type in ["convf", "convv"]:
                if layer_type == "convv":
                    mod = nn.Conv2d(channels[-1], filters, kernel, stride=1, padding=0, dilation=1, groups=1, bias=True)
                    input_dim.append(input_dim[-1]-kernel+1)
                else:
                    mod = nn.Conv2d(channels[-1], filters, kernel, stride=1, padding=kernel-1, dilation=1, groups=1, bias=True)
                    input_dim.append(input_dim[-1]-kernel+1+2*(kernel-1))
                channels.append(filters)
                filter_count.append(filters)
            elif layer_type in ["maxpool"]:
                mod = nn.MaxPool2d(kernel, stride=None, padding=0, dilation=1, return_indices=False, ceil_mode=False)
                input_dim.append(input_dim[-1]/kernel)
            elif layer_type in ["fc"]:
                out_sz = filters
                mod = nn.Linear(, out_sz)
                input_dim.append(input_dim[-1]/kernel)
            else:
                raise ValueError("Invalid layer type")
            layer_modules[l] = mod

            # Batcn normalization module if True
            if bn:
                bnmod = nn.BatchNorm2d(filter_count[-1], eps=1e-05, momentum=0.1, affine=True)
            else:
                bnmod = None
            bn_modules[l] = bnmod

            # Activation function
            if act == "relu":
                actmod = F.relu
            elif act == "lrelu":
                actmod = F.leaky_relu
            else:
                actmod = None
            act_modules[l] = actmod

        # Set the total number of parameters after convolution layers (for fc layers)
        self.flat_count = int(filter_count[-1]*input_dim[-1]*input_dim[-1])
        return layer_modules, bn_modules, act_modules

    def flattened_count(self, i):
        fl_ct = 1
        for l, layer in enumerate(layers):
            if (l < i):
                fl_ct *= int()



# Training settings
parser = argparse.ArgumentParser(description='PyTorch MNIST Example')
parser.add_argument('--batch-size', type=int, default=50, metavar='N',
                    help='input batch size for training (default: 64)')
parser.add_argument('--test-batch-size', type=int, default=1000, metavar='N',
                    help='input batch size for testing (default: 1000)')
parser.add_argument('--epochs', type=int, default=500, metavar='N',
                    help='number of epochs to train (default: 10)')
parser.add_argument('--lr', type=float, default=0.001, metavar='LR',
                    help='learning rate (default: 0.01)')
parser.add_argument('--momentum', type=float, default=0.5, metavar='M',
                    help='SGD momentum (default: 0.5)')
parser.add_argument('--no-cuda', action='store_true', default=False,
                    help='enables CUDA training')
parser.add_argument('--seed', type=int, default=1, metavar='S',
                    help='random seed (default: 1)')
parser.add_argument('--log-interval', type=int, default=10, metavar='N',
                    help='how many batches to wait before logging training status')
args = parser.parse_args()
args.cuda = not args.no_cuda and torch.cuda.is_available()

torch.manual_seed(args.seed)
if args.cuda:
    torch.cuda.manual_seed(args.seed)

kwargs = {'num_workers': 1, 'pin_memory': True} if args.cuda else {}

#Dataloading
print('Loading Data!')

transform = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
)

trainset = torchvision.datasets.MNIST(root='./mnist', download=True, train=True, transform=transform)
train_loader = torch.utils.data.DataLoader(trainset, batch_size=4, shuffle=True, num_workers=2)

testset = torchvision.datasets.MNIST(root='./mnist', download=True, train=False, transform=transform)
test_loader = torch.utils.data.DataLoader(testset, shuffle=False, batch_size=4, num_workers=2)

print("Data loaded!")

# layer arguments: layer-type, filter-count, kernel-size, batch-normalization-boolean, activation
#layers = [["convv", 32, 5, False, ""], ["maxpool", 0, 2, True, "lrelu"], ["convv", 64, 3, True, "lrelu"], ["convv", 64, 3, False, ""],
#         ["maxpool", 0, 2, True, "lrelu"], ["convv", 128, 3, True, "lrelu"]]

layers = ###LAYERS###

model = ConvNet(layers)

if args.cuda:
    model.cuda()

#optimizer
optimizer = optim.Adam(model.parameters(), lr=args.lr, weight_decay=0.0001)

#Loss function
criterion = nn.MSELoss(size_average=True) # mse loss for reconstruction error

def validate(epoch):
    model.eval()
    validation_loss = 0
    correct = 0
    for batch_idx, (data, target) in enumerate(validation_loader):
        data, target = Variable(data, volatile=True), Variable(target)
        output = model(data)
        validation_loss += criterion(output, target).data[0] # no reconstruction loss

    return validation_loss

def test():
    model.eval()
    for batch_idx, (data, target) in enumerate(validation_loader):
        data, target = Variable(data, volatile=True), Variable(target)
        output = model(data)
        validation_loss += criterion(output, target).data[0] # no reconstruction loss

    return validation_loss

# training
model.train()
for epoch in range(1, args.epochs + 1):
    training_loss = 0
    for i, data in enumerate(train_loader):
        inputs, labels = data
        inputs, labels = Variable(inputs), Variable(labels)
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        training_loss += loss.data[0]

    validation_loss = validate(epoch)
    if validation_loss < best_loss:
        torch.save(model, "%s/model_%d" % (epoch))
        best_loss = validation_loss

    if epoch % print_every == 0:
        #print the stats
        pass
